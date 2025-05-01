
import { supabase } from '@/lib/supabase';
import { CartItem } from '@/types/cart';

interface AddCartItemParams {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

// Adds an item to the user's cart
export const addCartItem = async (params: AddCartItemParams): Promise<boolean> => {
  try {
    const { userId, productId, quantity, price, color, size } = params;
    
    // First check if the item already exists in the cart
    const { data: existingItem, error: checkError } = await supabase
      .from('user_cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color', color || '')
      .eq('size', size || '')
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking cart:', checkError);
      return false;
    }
    
    if (existingItem) {
      // If item exists, update the quantity
      const newQuantity = existingItem.quantity + quantity;
      
      const { error: updateError } = await supabase
        .from('user_cart_items')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingItem.id);
        
      if (updateError) {
        console.error('Error updating cart item quantity:', updateError);
        return false;
      }
    } else {
      // If item doesn't exist, insert a new record
      const { error: insertError } = await supabase
        .from('user_cart_items')
        .insert([{
          user_id: userId,
          product_id: productId,
          quantity,
          color: color || null,
          size: size || null,
          added_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Error adding item to cart:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in addCartItem:', error);
    return false;
  }
};

// ... Add other cart service functions here
export const clearCart = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
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

export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('user_cart_items')
      .select(`
        *,
        product:product_id (*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
    
    // Transform the Supabase response into CartItem objects
    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.product.name,
      price: item.product.sale_price || item.product.price,
      image: item.product.images?.[0] || '/placeholder.png',
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      stock: item.product.stock,
      shopId: item.product.shop_id,
      total: (item.product.sale_price || item.product.price) * item.quantity
    }));
  } catch (error) {
    console.error('Error in fetchUserCart:', error);
    return [];
  }
};

export const upsertCartItem = async (
  userId: string, 
  productId: string, 
  quantity: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in upsertCartItem:', error);
    return false;
  }
};

export const removeCartItem = async (
  userId: string,
  itemId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('id', itemId);
      
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
