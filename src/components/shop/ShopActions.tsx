import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Store, Share2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ShopActionsProps {
  shopId: string;
  isFollowing: boolean;
  isFollowLoading: boolean;
  handleFollow: () => Promise<void>;
  handleShare: () => Promise<void>;
  shopName: string;
  onAuthDialogOpen: (open: boolean) => void;
}

const ShopActions: React.FC<ShopActionsProps> = ({
  shopId,
  isFollowing,
  isFollowLoading,
  handleFollow,
  handleShare,
  shopName,
  onAuthDialogOpen
}) => {
  const { isDarkMode } = useTheme();
  const { isSupabaseAuthenticated, currentUser } = useAuth();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleFollowClick = async () => {
    // Double-check authentication status
    if (!isSupabaseAuthenticated || !currentUser) {
      console.log('User not authenticated, showing auth dialog');
      onAuthDialogOpen(true);
      return;
    }
    
    try {
      setIsActionLoading(true);
      await handleFollow();
    } catch (error) {
      console.error('Error in follow action:', error);
      toast.error('Failed to update follow status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShareClick = async () => {
    try {
      setIsActionLoading(true);
      await handleShare();
    } catch (error) {
      console.error('Error sharing shop:', error);
      toast.error('Failed to share shop');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Determine if any action is in loading state
  const isLoading = isFollowLoading || isActionLoading;

  return (
    <div className="absolute bottom-0 right-0 p-2 flex gap-1.5">
      <Button 
        size="sm" 
        variant="secondary" 
        className={cn(
          "h-7 text-xs px-2.5",
          isDarkMode ? "bg-gray-700/80 text-gray-200" : "bg-white/80"
        )}
        onClick={handleShareClick}
        disabled={isLoading}
      >
        <Share2 className="h-3 w-3 mr-1" />
        Share
      </Button>
      <Button 
        size="sm" 
        className={cn(
          "h-7 text-xs px-2.5",
          isFollowing ? 
            (isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-600 hover:bg-gray-700 text-white") : 
            (isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600 text-white"),
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        )}
        onClick={handleFollowClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
            {isFollowing ? 'Unfollowing...' : 'Following...'}
          </span>
        ) : (
          <>
            <Store className="h-3 w-3 mr-1" />
            {isFollowing ? 'Unfollow' : 'Follow'}
          </>
        )}
      </Button>
    </div>
  );
};

export default ShopActions;
