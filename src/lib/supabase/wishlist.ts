
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
