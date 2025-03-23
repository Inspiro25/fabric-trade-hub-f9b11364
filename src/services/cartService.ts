
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { Product } from '@/lib/products';
import { toast } from 'sonner';

// Fetch cart items from Supabase
export const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    // Get cart items for user
    const { data: cartItems, error } = await supabase
      .from('user_cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .eq('saved_for_later', false);
    
    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
    
    // Transform data to CartItem format
    return cartItems.map(item => {
      const product = item.product as any;
      return {
        id: item.product_id,
        product: {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category_id || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          isNew: product.is_new || false,
          isTrending: product.is_trending || false,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0,
          tags: product.tags || [],
          shopId: product.shop_id || '',
        },
        quantity: item.quantity,
        color: item.color || '',
        size: item.size || '',
      };
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

// Add or update cart item
export const upsertCartItem = async (item: {
  user_id: string;
  product_id: string;
  quantity: number;
  color?: string;
  size?: string;
}): Promise<boolean> => {
  try {
    // Check if item already exists
    const { data: existingItem, error: fetchError } = await supabase
      .from('user_cart_items')
      .select('*')
      .eq('user_id', item.user_id)
      .eq('product_id', item.product_id)
      .eq('color', item.color || '')
      .eq('size', item.size || '')
      .eq('saved_for_later', false)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking existing cart item:', fetchError);
      return false;
    }
    
    if (existingItem) {
      // Update existing item
      const { error: updateError } = await supabase
        .from('user_cart_items')
        .update({ 
          quantity: item.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id);
      
      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return false;
      }
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('user_cart_items')
        .insert({
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          color: item.color || '',
          size: item.size || '',
          saved_for_later: false
        });
      
      if (insertError) {
        console.error('Error adding item to cart:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error upserting cart item:', error);
    return false;
  }
};

// Remove item from cart
export const removeCartItem = async (
  userId: string,
  productId: string,
  size: string = '',
  color: string = ''
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color', color)
      .eq('size', size)
      .eq('saved_for_later', false);
    
    if (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  size: string = '',
  color: string = '',
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
      .eq('product_id', productId)
      .eq('color', color)
      .eq('size', size)
      .eq('saved_for_later', false);
    
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

// Clear cart
export const clearUserCart = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('saved_for_later', false);
    
    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Move item to saved for later
export const moveToSavedForLater = async (
  userId: string,
  productId: string,
  size: string = '',
  color: string = ''
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .update({ 
        saved_for_later: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color', color)
      .eq('size', size);
    
    if (error) {
      console.error('Error moving item to saved for later:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error moving item to saved for later:', error);
    return false;
  }
};

// Move item from saved for later back to cart
export const moveToCart = async (
  userId: string,
  productId: string,
  size: string = '',
  color: string = ''
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_cart_items')
      .update({ 
        saved_for_later: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('color', color)
      .eq('size', size);
    
    if (error) {
      console.error('Error moving item to cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error moving item to cart:', error);
    return false;
  }
};

// Fetch saved for later items
export const fetchSavedForLater = async (userId: string): Promise<CartItem[]> => {
  try {
    // Get saved items for user
    const { data: savedItems, error } = await supabase
      .from('user_cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .eq('saved_for_later', true);
    
    if (error) {
      console.error('Error fetching saved items:', error);
      return [];
    }
    
    // Transform data to CartItem format
    return savedItems.map(item => {
      const product = item.product as any;
      return {
        id: item.product_id,
        product: {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category_id || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          isNew: product.is_new || false,
          isTrending: product.is_trending || false,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0,
          tags: product.tags || [],
          shopId: product.shop_id || '',
        },
        quantity: item.quantity,
        color: item.color || '',
        size: item.size || '',
      };
    });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    return [];
  }
};
