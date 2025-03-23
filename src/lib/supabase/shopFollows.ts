
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to check if a user follows a shop
export const checkFollowStatus = async (shopId: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No session found when checking follow status");
      return false;
    }

    const userId = session.user.id;
    console.log("Checking follow status for user:", userId, "shop:", shopId);
    
    // Check if the relationship exists
    const { data, error } = await supabase
      .from('shop_follows')
      .select('id')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Code for "no rows returned"
      console.error('Error checking follow status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkFollowStatus:', error);
    return false;
  }
};

// Function to follow a shop
export const followShop = async (shopId: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No active session found when attempting to follow shop");
      return false;
    }

    const userId = session.user.id;
    console.log("Following shop:", shopId, "for user:", userId);
    
    // Insert the follow relationship
    const { error } = await supabase
      .from('shop_follows')
      .insert({
        user_id: userId,
        shop_id: shopId
      });
    
    if (error) {
      // If the error is a unique violation, the user already follows this shop
      if (error.code === '23505') {
        console.log("User already follows this shop");
        return true;
      }
      
      console.error('Error following shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in followShop:', error);
    return false;
  }
};

// Function to unfollow a shop
export const unfollowShop = async (shopId: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No active session found when attempting to unfollow shop");
      return false;
    }

    const userId = session.user.id;
    console.log("Unfollowing shop:", shopId, "for user:", userId);
    
    // Delete the follow relationship
    const { error } = await supabase
      .from('shop_follows')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error unfollowing shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in unfollowShop:', error);
    return false;
  }
};

// Function to get followers count for a shop
export const getShopFollowersCount = async (shopId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('followers_count')
      .eq('id', shopId)
      .single();
    
    if (error) {
      console.error('Error fetching shop followers count:', error);
      return 0;
    }
    
    return data.followers_count || 0;
  } catch (error) {
    console.error('Error in getShopFollowersCount:', error);
    return 0;
  }
};
