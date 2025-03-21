
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Create a type for the cart_items table based on the SQL structure
export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  color: string;
  size: string;
  created_at?: string;
};

// Helper function to treat cart_items as a table
export const getCartTable = () => {
  // This is a workaround for TypeScript not recognizing the cart_items table
  // @ts-expect-error - The cart_items table exists in the database but not in the TypeScript types
  return supabase.from('cart_items') as ReturnType<typeof supabase.from<CartItem>>;
};

// Helper function to get a user's cart items
export const fetchUserCart = async (userId: string) => {
  const cartTable = getCartTable();
  const { data, error } = await cartTable
    .select(`
      id,
      product_id,
      quantity,
      color,
      size
    `)
    .eq('user_id', userId);
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

// Helper function to add/update cart item
export const upsertCartItem = async (item: Omit<CartItem, 'id' | 'created_at'>) => {
  const cartTable = getCartTable();
  const { error } = await cartTable
    .upsert(item, {
      onConflict: 'user_id, product_id, color, size'
    });
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Helper function to remove cart item
export const removeCartItem = async (userId: string, productId: string, size: string, color: string) => {
  const cartTable = getCartTable();
  const { error } = await cartTable
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('color', color);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Helper function to clear cart
export const clearUserCart = async (userId: string) => {
  const cartTable = getCartTable();
  const { error } = await cartTable
    .delete()
    .eq('user_id', userId);
    
  if (error) {
    throw error;
  }
  
  return true;
};

// Helper function to update cart item quantity
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number
) => {
  const cartTable = getCartTable();
  const { error } = await cartTable
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('color', color);
    
  if (error) {
    throw error;
  }
  
  return true;
};
