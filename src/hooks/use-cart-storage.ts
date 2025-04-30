
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

interface UseCartStorageOptions {
  debounceMs?: number;
}

export function useCartStorage(currentUser: any, options: UseCartStorageOptions = {}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimer = useRef<number | null>(null);
  
  // Load cart data when user changes
  useEffect(() => {
    loadCart();
  }, [currentUser?.id]);
  
  // Function to load cart data from appropriate source
  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      if (currentUser?.id) {
        // Get cart data from Supabase for logged in users
        const { data, error } = await supabase
          .from('user_cart_items')
          .select(`
            id, 
            product_id, 
            quantity, 
            color, 
            size, 
            price,
            total,
            created_at,
            updated_at,
            products (
              id,
              name,
              price,
              sale_price,
              images,
              stock,
              shop_id
            )
          `)
          .eq('user_id', currentUser.id)
          .eq('saved_for_later', false);
          
        if (error) throw error;
        
        // Transform to CartItem format
        const transformedItems: CartItem[] = data.map(item => ({
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          name: item.products.name,
          image: Array.isArray(item.products.images) && item.products.images.length > 0 
            ? item.products.images[0] 
            : '',
          price: item.products.sale_price || item.products.price,
          stock: item.products.stock || 10,
          shopId: item.products.shop_id,
          total: (item.products.sale_price || item.products.price) * item.quantity,
          color: item.color || undefined,
          size: item.size || undefined
        }));
        
        setCartItems(transformedItems);
      } else {
        // Get cart from localStorage for guests
        const guestCartStr = localStorage.getItem('guest_cart');
        if (guestCartStr) {
          try {
            const guestCart = JSON.parse(guestCartStr);
            setCartItems(guestCart);
          } catch (e) {
            console.error('Failed to parse guest cart:', e);
            localStorage.removeItem('guest_cart');
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    } catch (e) {
      console.error('Error loading cart:', e);
      toast.error('Failed to load your cart');
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { cartItems, isLoading, loadCart };
}
