
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Check if the current user is following a shop
 * @param shopId The ID of the shop to check
 * @returns Boolean indicating if the user is following the shop
 */
export const checkFollowStatus = async (shopId: string): Promise<boolean> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.log('No active session found when checking follow status');
      return false;
    }
    
    const userId = session.user.id;
    console.log(`Checking follow status for shop: ${shopId} and user: ${userId}`);

    // Check if the user is following the shop
    const { data, error } = await supabase
      .from('shop_follows')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
    
    const isFollowing = !!data;
    console.log(`User ${userId} is ${isFollowing ? '' : 'not '}following shop ${shopId}`);
    return isFollowing;
  } catch (error) {
    console.error('Exception checking follow status:', error);
    return false;
  }
};

/**
 * Follow a shop
 * @param shopId The ID of the shop to follow
 * @returns Boolean indicating success or failure
 */
export const followShop = async (shopId: string): Promise<boolean> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.log('No active session found when attempting to follow shop');
      toast.error("Please log in to follow shops");
      return false;
    }
    
    const userId = session.user.id;
    console.log(`Following shop: ${shopId} for user: ${userId}`);
    
    // First check if the follow already exists to prevent duplicates
    const { data: existingFollow } = await supabase
      .from('shop_follows')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (existingFollow) {
      console.log('User is already following this shop');
      return true; // Already following, return success
    }

    // Create the follow record
    const { error } = await supabase
      .from('shop_follows')
      .insert([
        { shop_id: shopId, user_id: userId }
      ]);
    
    if (error) {
      console.error('Error following shop:', error);
      toast.error("Could not follow shop. Please try again.");
      return false;
    }
    
    console.log(`Successfully followed shop ${shopId}`);
    return true;
  } catch (error) {
    console.error('Exception following shop:', error);
    toast.error("Could not follow shop. Please try again.");
    return false;
  }
};

/**
 * Unfollow a shop
 * @param shopId The ID of the shop to unfollow
 * @returns Boolean indicating success or failure
 */
export const unfollowShop = async (shopId: string): Promise<boolean> => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.log('No active session found when attempting to unfollow shop');
      toast.error("Please log in to manage shop follows");
      return false;
    }
    
    const userId = session.user.id;
    console.log(`Unfollowing shop: ${shopId} for user: ${userId}`);

    // Delete the follow record
    const { error } = await supabase
      .from('shop_follows')
      .delete()
      .eq('shop_id', shopId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error unfollowing shop:', error);
      toast.error("Could not unfollow shop. Please try again.");
      return false;
    }
    
    console.log(`Successfully unfollowed shop ${shopId}`);
    return true;
  } catch (error) {
    console.error('Exception unfollowing shop:', error);
    toast.error("Could not unfollow shop. Please try again.");
    return false;
  }
};

/**
 * Get the number of followers for a shop
 * @param shopId The ID of the shop to get followers count for
 * @returns Number of followers
 */
export const getShopFollowersCount = async (shopId: string): Promise<number> => {
  try {
    // Count followers
    const { count, error } = await supabase
      .from('shop_follows')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error getting shop followers count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Exception getting shop followers count:', error);
    return 0;
  }
};

/**
 * Fetch detailed list of shop followers
 * @param shopId The ID of the shop to get followers for
 * @returns Array of follower details
 */
export const fetchShopFollowers = async (shopId: string) => {
  try {
    // Get follower details from the shop_follower_details view
    const { data, error } = await supabase
      .from('shop_follower_details')
      .select('*')
      .eq('shop_id', shopId)
      .order('followed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop followers:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching shop followers:', error);
    return [];
  }
};
