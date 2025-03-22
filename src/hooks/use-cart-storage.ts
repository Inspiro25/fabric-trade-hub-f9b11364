
import { useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchCartItems, 
  upsertCartItem, 
  removeCartItem, 
  clearUserCart, 
  updateCartItemQuantity 
} from '@/lib/supabase/cart';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'guest_cart';

/**
 * Hook to manage cart storage operations (localStorage and Supabase)
 */
export const useCartStorage = (currentUser: any | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousAuthState, setPreviousAuthState] = useState<boolean>(!!currentUser);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch cart from database when user logs in or out
  useEffect(() => {
    const fetchUserCartItems = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser) {
          // If user is logged in, get cart from Supabase
          const cartData = await fetchCartItems(currentUser.uid);

          if (cartData && cartData.length > 0) {
            // Fetch full product details for each cart item
            const cartWithProducts = await Promise.all(
              cartData.map(async (item) => {
                try {
                  const { data: productData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', item.id)
                    .single();

                  if (!productData) {
                    console.warn(`Product not found for ID: ${item.id}`);
                    return null;
                  }

                  // Convert Supabase product data format to our Product type
                  const product = {
                    id: productData.id,
                    name: productData.name,
                    description: productData.description || '',
                    price: productData.price,
                    salePrice: productData.sale_price,
                    images: productData.images || [],
                    category: productData.category_id || '',
                    colors: productData.colors || [],
                    sizes: productData.sizes || [],
                    isNew: productData.is_new || false,
                    isTrending: productData.is_trending || false,
                    rating: productData.rating || 0,
                    reviewCount: productData.review_count || 0,
                    stock: productData.stock || 0,
                    tags: productData.tags || [],
                    shopId: productData.shop_id || '',
                  };

                  return {
                    id: item.id,
                    product,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size
                  };
                } catch (err) {
                  console.error(`Error fetching product ${item.id}:`, err);
                  return null;
                }
              })
            );

            // Filter out any null items (products that weren't found)
            const validCartItems = cartWithProducts.filter(item => item !== null) as CartItem[];
            setCartItems(validCartItems);
          } else {
            setCartItems([]);
          }
        } else {
          // If user is not logged in, use localStorage
          const savedCart = localStorage.getItem(STORAGE_KEY);
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              setCartItems(parsedCart);
            } catch (error) {
              console.error('Error parsing cart from localStorage:', error);
              localStorage.removeItem(STORAGE_KEY);
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        
        // Only show error toast if it's not a database format error and not during initial load
        if (retryCount > 0 && !String(error).includes("invalid input syntax for type uuid")) {
          // Use shadcn/ui toast - We're omitting this to reduce notifications
          // toast({
          //   title: "Error",
          //   description: "Failed to load your cart",
          //   variant: "destructive",
          // });
        }
        
        // Fallback to localStorage if there's an error
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
        
        // Increment retry count for future error handling
        setRetryCount(prev => prev + 1);
      } finally {
        setIsLoading(false);
        // Update previous auth state
        setPreviousAuthState(!!currentUser);
      }
    };

    // Only fetch cart items if auth state changed or on initial load
    fetchUserCartItems();
  }, [currentUser, retryCount]);

  // Save to localStorage whenever cartItems changes if user is not logged in
  useEffect(() => {
    if (!currentUser && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, isLoading]);

  return {
    cartItems,
    setCartItems,
    isLoading
  };
};
