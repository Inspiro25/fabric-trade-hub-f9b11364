import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { followShop, unfollowShop, isFollowingShop } from '@/services/shopFollowService';
import { toast } from 'sonner';

interface FollowButtonProps {
  shopId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function FollowButton({ 
  shopId, 
  variant = 'default',
  size = 'default',
  className = ''
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [shopId]);

  const checkFollowStatus = async () => {
    try {
      const following = await isFollowingShop(shopId);
      setIsFollowing(following);
    } catch (error) {
      console.error('Error checking follow status:', error);
      toast.error('Failed to check follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowClick = async () => {
    try {
      setIsLoading(true);
      if (isFollowing) {
        await unfollowShop(shopId);
        setIsFollowing(false);
        toast.success('Unfollowed shop');
      } else {
        await followShop(shopId);
        setIsFollowing(true);
        toast.success('Following shop');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleFollowClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
} 