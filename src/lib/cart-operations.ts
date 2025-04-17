import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';
import { Product } from '@/lib/products/types';
import { v4 as uuidv4 } from 'uuid';

export const useCartOperations = (
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  currentUser: any
) => {
  const addToCart = (product: Product, quantity: number, color: string, size: string) => {
    const existingItem = cartItems.find(
      (item) => 
        item.product.id === product.id && 
        item.color === color && 
        item.size === size
    );

    if (existingItem) {
      // Update quantity if the same item is already in cart
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Add new item
      const now = new Date().toISOString();
      const price = product.sale_price || product.price;
      const newItem: CartItem = {
        id: uuidv4(),
        product,
        quantity,
        color,
        size,
        price,
        total: price * quantity,
        created_at: now,
        updated_at: now
      };

      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);

      // Save to storage
      if (currentUser) {
        saveCartToDatabase(updatedCart, currentUser.id);
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      }
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);

    // Save to storage
    if (currentUser) {
      saveCartToDatabase(updatedCart, currentUser.id);
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map((item) => {
      if (item.id === itemId) {
        const price = item.product.sale_price || item.product.price;
        return { 
          ...item, 
          quantity,
          total: price * quantity,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });
    setCartItems(updatedCart);

    // Save to storage
    if (currentUser) {
      saveCartToDatabase(updatedCart, currentUser.id);
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = () => {
    setCartItems([]);

    // Clear storage
    if (currentUser) {
      clearCartInDatabase(currentUser.id);
    } else {
      localStorage.removeItem('guest_cart');
    }
  };

  const migrateGuestCartToUser = async () => {
    if (!currentUser) return;

    const guestCart = localStorage.getItem('guest_cart');
    if (!guestCart) return;

    try {
      const parsedCart = JSON.parse(guestCart);
      if (Array.isArray(parsedCart) && parsedCart.length > 0) {
        await saveCartToDatabase(parsedCart, currentUser.id);
        setCartItems(parsedCart);
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error('Error migrating guest cart:', error);
      throw error;
    }
  };

  // Helper functions for database operations
  const saveCartToDatabase = async (cart: CartItem[], userId: string) => {
    try {
      // First, remove all existing items for this user
      await supabase.from('cart_items').delete().eq('user_id', userId);

      // Then, insert all current items
      if (cart.length > 0) {
        const cartData = cart.map(item => ({
          user_id: userId,
          product_id: item.product.id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: item.price,
          total: item.total,
          created_at: item.created_at,
          updated_at: item.updated_at,
          id: item.id
        }));

        const { error } = await supabase.from('cart_items').insert(cartData);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
      throw error; // Propagate error to handle it in the UI
    }
  };

  const clearCartInDatabase = async (userId: string) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart in database:', error);
      throw error; // Propagate error to handle it in the UI
    }
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    migrateGuestCartToUser,
  };
};
