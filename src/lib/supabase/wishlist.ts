
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Get wishlist items for a user
 * @param userId The ID of the user
 * @returns Array of wishlist items
 */
export const getWishlistItems = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWishlistItems:', error);
    return [];
  }
};

/**
 * Add a product to a user's wishlist
 * @param userId The ID of the user
 * @param productId The ID of the product
 * @returns Boolean indicating success
 */
export const addToWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    // Check if item is already in wishlist
    const { data: existingItem, error: checkError } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking wishlist:', checkError);
      return false;
    }
    
    // If item already exists, just return true
    if (existingItem) {
      return true;
    }
    
    // Add the item to wishlist
    const { error } = await supabase
      .from('user_wishlists')
      .insert([
        { user_id: userId, product_id: productId }
      ]);
      
    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    return false;
  }
};

/**
 * Remove a product from a user's wishlist
 * @param userId The ID of the user
 * @param productId The ID of the product
 * @returns Boolean indicating success
 */
export const removeFromWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    return false;
  }
};

/**
 * Check if product is in user's wishlist
 * @param userId The ID of the user
 * @param productId The ID of the product
 * @returns Boolean indicating if product is in wishlist
 */
export const isProductInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking wishlist:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isProductInWishlist:', error);
    return false;
  }
};
