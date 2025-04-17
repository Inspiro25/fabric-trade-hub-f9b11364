import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';
import { fetchProductById } from '@/lib/products'; // We need this to get product details
import { firebaseUIDToUUID } from '@/utils/format';

export const useCartStorage = (currentUser: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial cart items
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
                    size: item.size,
                    price: item.price,
                    total: item.total,
                    created_at: item.created_at,
                    updated_at: item.updated_at
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
          // Load guest cart from localStorage
          const guestCart = localStorage.getItem('guest_cart');
          if (guestCart) {
            try {
              const parsedCart = JSON.parse(guestCart);
              setCartItems(parsedCart);
            } catch (e) {
              console.error('Error parsing guest cart:', e);
              localStorage.removeItem('guest_cart');
              setCartItems([]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [currentUser]);

  // Subscribe to real-time cart changes
  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to cart changes
    const cartSubscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${currentUser.id}`
        },
        async (payload) => {
          console.log('Cart change received:', payload);
          
          // Reload cart items when changes occur
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', currentUser.id);
            
          if (error) {
            console.error('Error reloading cart:', error);
            return;
          }
          
          if (data) {
            const cartItemsPromises = data.map(async (item) => {
              try {
                const product = await fetchProductById(item.product_id);
                if (product) {
                  return {
                    id: item.id,
                    product,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    total: item.total,
                    created_at: item.created_at,
                    updated_at: item.updated_at
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
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      cartSubscription.unsubscribe();
    };
  }, [currentUser]);

  return { cartItems, isLoading };
};
