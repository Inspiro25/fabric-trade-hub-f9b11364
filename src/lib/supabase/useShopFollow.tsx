
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { checkFollowStatus, followShop, unfollowShop, getShopFollowersCount } from './shopFollows';

export const useShopFollow = (shopId: string) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Check auth status and load initial data
  useEffect(() => {
    const checkAuthAndFollowStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        const loggedIn = !!session?.user;
        setIsUserLoggedIn(loggedIn);
        
        // Get followers count
        const count = await getShopFollowersCount(shopId);
        setFollowersCount(count);
        
        // Check follow status if logged in
        if (loggedIn) {
          const status = await checkFollowStatus(shopId);
          setIsFollowing(status);
        }
      } catch (error) {
        console.error('Error checking shop follow status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (shopId) {
      checkAuthAndFollowStatus();
    }
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const loggedIn = !!session?.user;
      setIsUserLoggedIn(loggedIn);
      
      if (loggedIn && shopId) {
        const status = await checkFollowStatus(shopId);
        setIsFollowing(status);
      } else if (!loggedIn) {
        // Reset following status if logged out
        setIsFollowing(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [shopId]);
  
  // Toggle follow status
  const toggleFollow = useCallback(async () => {
    if (!shopId) return false;
    
    // Check auth status first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to follow shops");
      return false; // Caller should handle showing auth dialog
    }
    
    setIsFollowLoading(true);
    
    try {
      let success;
      
      if (isFollowing) {
        success = await unfollowShop(shopId);
        if (success) {
          setIsFollowing(false);
          setFollowersCount(prev => Math.max(0, prev - 1));
          toast.success("Shop unfollowed successfully");
        }
      } else {
        success = await followShop(shopId);
        if (success) {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          toast.success("Now following this shop");
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error toggling shop follow:', error);
      toast.error("Failed to update follow status");
      return false;
    } finally {
      setIsFollowLoading(false);
    }
  }, [shopId, isFollowing]);
  
  return {
    isFollowing,
    followersCount,
    isLoading,
    isFollowLoading,
    isUserLoggedIn,
    toggleFollow
  };
};
