import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ShopFollow {
  id: string;
  shop_id: string;
  user_id: string;
  created_at: string;
}

export async function followShop(shopId: string): Promise<ShopFollow | null> {
  try {
    // Get the current Supabase user
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      console.error('No authenticated user found');
      toast.error('Please log in to follow shops');
      throw new Error('User not authenticated');
    }

    console.log(`Following shop: ${shopId} for user: ${supabaseUser.id}`);

    // Check if already following
    const { data: existingFollow, error: checkError } = await supabase
      .from('shop_follows')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', supabaseUser.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking follow status:', checkError);
      throw checkError;
    }

    if (existingFollow) {
      console.log('User is already following this shop');
      return existingFollow;
    }

    // Create new follow
    const { data: newFollow, error: insertError } = await supabase
      .from('shop_follows')
      .insert({
        shop_id: shopId,
        user_id: supabaseUser.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error following shop:', insertError);
      if (insertError.code === '23503') {
        toast.error('Shop not found');
      } else {
        toast.error('Failed to follow shop');
      }
      throw insertError;
    }

    // Update shop followers count
    const { error: updateError } = await supabase.rpc('increment_shop_followers', {
      shop_id: shopId
    });

    if (updateError) {
      console.error('Error updating followers count:', updateError);
    }

    return newFollow;
  } catch (error) {
    console.error('Error following shop:', error);
    throw error;
  }
}

export async function unfollowShop(shopId: string): Promise<void> {
  try {
    // Get the current Supabase user
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      console.error('No authenticated user found');
      toast.error('Please log in to manage shop follows');
      throw new Error('User not authenticated');
    }

    console.log(`Unfollowing shop: ${shopId} for user: ${supabaseUser.id}`);

    const { error } = await supabase
      .from('shop_follows')
      .delete()
      .eq('shop_id', shopId)
      .eq('user_id', supabaseUser.id);

    if (error) {
      console.error('Error unfollowing shop:', error);
      toast.error('Failed to unfollow shop');
      throw error;
    }

    // Update shop followers count
    const { error: updateError } = await supabase.rpc('decrement_shop_followers', {
      shop_id: shopId
    });

    if (updateError) {
      console.error('Error updating followers count:', updateError);
    }
  } catch (error) {
    console.error('Error unfollowing shop:', error);
    throw error;
  }
}

export async function isFollowingShop(shopId: string): Promise<boolean> {
  try {
    // Get the current Supabase user
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    
    if (!supabaseUser) {
      return false;
    }

    const { data, error } = await supabase
      .from('shop_follows')
      .select('id')
      .eq('shop_id', shopId)
      .eq('user_id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking follow status:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export async function getShopFollowers(shopId: string) {
  try {
    const { data, error } = await supabase
      .from('shop_follower_details')
      .select('*')
      .eq('shop_id', shopId)
      .order('followed_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop followers:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching shop followers:', error);
    throw error;
  }
} 