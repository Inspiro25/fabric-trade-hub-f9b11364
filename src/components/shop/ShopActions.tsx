
import React from 'react';
import { Button } from '@/components/ui/button';
import { Store, Share2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShopActionsProps {
  isFollowing: boolean;
  isFollowLoading: boolean;
  handleFollow: () => Promise<void>;
  handleShare: () => Promise<void>;
  shopName: string;
}

const ShopActions: React.FC<ShopActionsProps> = ({
  isFollowing,
  isFollowLoading,
  handleFollow,
  handleShare,
  shopName
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute bottom-0 right-0 p-2 flex gap-1.5">
      <Button 
        size="sm" 
        variant="secondary" 
        className={cn(
          "h-7 text-xs px-2.5",
          isDarkMode ? "bg-gray-700/80 text-gray-200" : "bg-white/80"
        )}
        onClick={handleShare}
      >
        <Share2 className="h-3 w-3 mr-1" />
        Share
      </Button>
      <Button 
        size="sm" 
        className={cn(
          "h-7 text-xs px-2.5",
          isFollowing ? 
            (isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-600 hover:bg-gray-700") : 
            (isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"),
          isFollowLoading ? "opacity-70 cursor-not-allowed" : ""
        )}
        onClick={handleFollow}
        disabled={isFollowLoading}
      >
        {isFollowLoading ? (
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
