
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { fetchProductById } from '@/lib/products'; // We need this to get product details

export const useCartStorage = (currentUser: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser) {
          // Load cart from database for logged in users
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', currentUser.id);
            
          if (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
          } else if (data) {
            // Convert database items to CartItems by fetching product details
            const cartItemsPromises = data.map(async (item) => {
              try {
                const product = await fetchProductById(item.product_id);
                if (product) {
                  return {
                    id: item.id,
                    product,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size
                  } as CartItem;
                }
                return null;
              } catch (err) {
                console.error(`Error fetching product ${item.product_id}:`, err);
                return null;
              }
            });
            
            const resolvedItems = await Promise.all(cartItemsPromises);
            const validItems = resolvedItems.filter(item => item !== null) as CartItem[];
            setCartItems(validItems);
          }
        } else {
          // Load cart from localStorage for guests
          const storedCart = localStorage.getItem('guest_cart');
          if (storedCart) {
            try {
              const parsedCart = JSON.parse(storedCart);
              setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
            } catch (e) {
              console.error('Error parsing stored cart:', e);
              setCartItems([]);
              localStorage.removeItem('guest_cart');
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Cart loading error:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, [currentUser]);

  return { cartItems, setCartItems, isLoading };
};
