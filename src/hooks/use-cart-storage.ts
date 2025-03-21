
import { useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchUserCart, 
  upsertCartItem, 
  removeCartItem, 
  clearUserCart, 
  updateCartItemQuantity 
} from '@/lib/supabase/cart';
import { toast } from 'sonner';

const STORAGE_KEY = 'guest_cart';

/**
 * Hook to manage cart storage operations (localStorage and Supabase)
 */
export const useCartStorage = (currentUser: any | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousAuthState, setPreviousAuthState] = useState<boolean>(!!currentUser);

  // Fetch cart from database when user logs in or out
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser) {
          // If user is logged in, get cart from Supabase
          const cartData = await fetchUserCart(currentUser.uid);

          if (cartData.length > 0) {
            // Fetch full product details for each cart item
            const cartWithProducts = await Promise.all(
              cartData.map(async (item) => {
                const { data: productData } = await supabase
                  .from('products')
                  .select('*')
                  .eq('id', item.product_id)
                  .single();

                if (!productData) {
                  console.warn(`Product not found for ID: ${item.product_id}`);
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
                  id: item.product_id,
                  product,
                  quantity: item.quantity,
                  color: item.color,
                  size: item.size
                };
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
        toast.error('Failed to load your cart');
        
        // Fallback to localStorage if there's an error
        const savedCart = localStorage.getItem(STORAGE_KEY);
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
            setCartItems([]);
          }
        }
      } finally {
        setIsLoading(false);
        // Update previous auth state
        setPreviousAuthState(!!currentUser);
      }
    };

    // Only fetch cart items if auth state changed or on initial load
    fetchCartItems();
  }, [currentUser]);

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
