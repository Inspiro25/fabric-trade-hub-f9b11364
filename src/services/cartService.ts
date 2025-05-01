
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CartItem } from '@/types/cart';

// Functions to interact with user's cart in Supabase
// Add an item to the cart
export const addCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
  price: number,
  color?: string,
  size?: string
) => {
  try {
    const { data: existingItem, error: checkError } = await supabase
      .from('user_cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color', color || null)
      .eq('size', size || null)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking cart:', checkError);
      return false;
    }
    
    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      const { error: updateError } = await supabase
        .from('user_cart')
        .update({ quantity: newQuantity, updated_at: new Date() })
        .eq('id', existingItem.id);
        
      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return false;
      }
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('user_cart')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          price,
          color,
          size,
          created_at: new Date(),
          updated_at: new Date()
        });
        
      if (insertError) {
        console.error('Error adding to cart:', insertError);
        return false;
      }
    }
    
    toast.success('Item added to cart');
    return true;
  } catch (error) {
    console.error('Error in addCartItem:', error);
    return false;
  }
};

// Clear user cart
export const clearCart = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in clearCart:', error);
    return false;
  }
};

// Fetch user's cart items
export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('user_cart')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.products?.name || 'Unknown Product',
      image: item.products?.images?.[0] || '/placeholder.png',
      price: item.price || item.products?.price || 0,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      stock: item.products?.stock || 10,
      total: (item.price || item.products?.price || 0) * item.quantity
    }));
  } catch (error) {
    console.error('Error in fetchUserCart:', error);
    return [];
  }
};

// Update cart item quantity
export const upsertCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  try {
    const { error } = await supabase
      .from('user_cart')
      .update({ quantity, updated_at: new Date() })
      .eq('id', itemId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    return false;
  }
};

// Remove item from cart
export const removeCartItem = async (userId: string, itemId: string) => {
  try {
    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    return false;
  }
};
