
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

/**
 * Hook to manage cart storage operations (localStorage and Supabase)
 */
export const useCartStorage = (currentUser: any | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

            setCartItems(cartWithProducts);
          } else {
            setCartItems([]);
          }
        } else {
          // If user is not logged in, use localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load your cart');
        
        // Fallback to localStorage if there's an error
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser]);

  // Save to localStorage whenever cartItems changes if user is not logged in
  useEffect(() => {
    if (!currentUser && !isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, isLoading]);

  return {
    cartItems,
    setCartItems,
    isLoading
  };
};
