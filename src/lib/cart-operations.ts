
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { Product } from './products';
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
      const newItem: CartItem = {
        id: uuidv4(),
        product,
        quantity,
        color,
        size,
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

    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
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
          id: item.id
        }));

        const { error } = await supabase.from('cart_items').insert(cartData);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const clearCartInDatabase = async (userId: string) => {
    try {
      await supabase.from('cart_items').delete().eq('user_id', userId);
    } catch (error) {
      console.error('Error clearing cart in database:', error);
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
