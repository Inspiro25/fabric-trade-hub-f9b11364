
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Function to check if a user follows a shop
export const checkFollowStatus = async (shopId: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const userId = session.user.id;
    
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
      toast({
        title: 'Authentication required',
        description: 'Please sign in to follow shops',
        variant: 'destructive'
      });
      return false;
    }

    const userId = session.user.id;
    
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
        toast({
          title: 'Already following',
          description: 'You are already following this shop',
        });
        return true;
      }
      
      console.error('Error following shop:', error);
      toast({
        title: 'Failed to follow shop',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
    
    toast({
      title: 'Shop followed',
      description: 'You are now following this shop'
    });
    return true;
  } catch (error) {
    console.error('Error in followShop:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast({
      title: 'Failed to follow shop',
      description: errorMessage,
      variant: 'destructive'
    });
    return false;
  }
};

// Function to unfollow a shop
export const unfollowShop = async (shopId: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to manage shop follows',
        variant: 'destructive'
      });
      return false;
    }

    const userId = session.user.id;
    
    // Delete the follow relationship
    const { error } = await supabase
      .from('shop_follows')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error unfollowing shop:', error);
      toast({
        title: 'Failed to unfollow shop',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
    
    toast({
      title: 'Shop unfollowed',
      description: 'You are no longer following this shop'
    });
    return true;
  } catch (error) {
    console.error('Error in unfollowShop:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast({
      title: 'Failed to unfollow shop',
      description: errorMessage,
      variant: 'destructive'
    });
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
