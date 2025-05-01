
import { supabase } from '@/lib/supabase';

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
 * @param productId The ID of the product to add
 * @returns True if successful
 */
export const addToWishlistItem = async (userId: string, productId: string) => {
  try {
    // Check if the item is already in the wishlist
    const { data: existing, error: checkError } = await supabase
      .from('user_wishlists')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking wishlist:', checkError);
      return false;
    }

    if (existing) {
      // Item already exists in wishlist
      return true;
    }

    // Add the item to the wishlist
    const { error } = await supabase
      .from('user_wishlists')
      .insert({
        user_id: userId,
        product_id: productId
      });

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addToWishlistItem:', error);
    return false;
  }
};

/**
 * Remove a product from a user's wishlist
 * @param userId The ID of the user
 * @param productId The ID of the product to remove
 * @returns True if successful
 */
export const removeFromWishlistItem = async (userId: string, productId: string) => {
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
    console.error('Error in removeFromWishlistItem:', error);
    return false;
  }
};
