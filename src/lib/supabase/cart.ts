
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';

/**
 * Fetch cart items for a user from Supabase
 */
export const fetchCartItems = async (userId: string): Promise<Partial<CartItem>[]> => {
  try {
    // For all user IDs, use cart_items table with user_id field
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, color, size')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

/**
 * Add or update a cart item in Supabase
 */
export const upsertCartItem = async (item: {
  user_id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
}): Promise<boolean> => {
  try {
    // Use cart_items table with standard fields
    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: item.user_id,
        product_id: item.product_id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      });
    
    if (error) {
      console.error('Error upserting cart item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error upserting cart item:', error);
    return false;
  }
};

/**
 * Remove an item from the user's cart
 */
export const removeCartItem = async (
  userId: string,
  productId: string,
  size: string,
  color: string
): Promise<boolean> => {
  try {
    // Use cart_items table
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color);
    
    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
};

/**
 * Update the quantity of a cart item
 */
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number
): Promise<boolean> => {
  try {
    // Use cart_items table
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color);
    
    if (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
};

/**
 * Clear all items from the user's cart
 */
export const clearUserCart = async (userId: string): Promise<boolean> => {
  try {
    // Use cart_items table
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error clearing user cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing user cart:', error);
    return false;
  }
};

// Alias for fetchCartItems for backward compatibility
export const fetchUserCart = fetchCartItems;
