
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';

// Define the database cart item type to match Supabase schema
interface DBCartItem {
  id?: string;
  user_id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
}

/**
 * Fetch cart items for a user from Supabase
 */
export const fetchCartItems = async (userId: string): Promise<DBCartItem[]> => {
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
    
    // Add the user_id to each returned item
    return data ? data.map(item => ({
      ...item,
      user_id: userId
    })) : [];
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
    // Check if item exists first
    const { data: existingItems, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', item.user_id)
      .eq('product_id', item.product_id)
      .eq('color', item.color)
      .eq('size', item.size);
    
    if (checkError) {
      console.error('Error checking cart item:', checkError);
      return false;
    }
    
    // If item exists, update it
    if (existingItems && existingItems.length > 0) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: item.quantity })
        .eq('id', existingItems[0].id);
      
      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return false;
      }
    } else {
      // Otherwise insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert(item);
      
      if (insertError) {
        console.error('Error inserting cart item:', insertError);
        return false;
      }
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
