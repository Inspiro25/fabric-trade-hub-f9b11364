import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';  // Changed from Link to useNavigate
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface WishlistSectionProps {
  className?: string;
}

const WishlistSection: React.FC<WishlistSectionProps> = ({ className = "" }) => {
  const { wishlist, isLoading } = useWishlist();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const wishlistCount = wishlist?.length || 0;  // Added null check
  
  const handleWishlistClick = () => {
    try {
      navigate('/account/wishlist');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (isLoading) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        className={cn(
          "relative",
          isDarkMode ? "text-gray-400" : "text-gray-700",
          className
        )}
        disabled
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleWishlistClick}
      variant="ghost" 
      size="icon"
      className={cn(
        "relative transition-colors cursor-pointer",
        isDarkMode 
          ? "text-gray-300 hover:text-pink-400 hover:bg-gray-800" 
          : "text-gray-700 hover:text-pink-500 hover:bg-gray-100",
        className
      )}
    >
      <Heart className="w-5 h-5" />
      {wishlistCount > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center",
          isDarkMode ? "bg-pink-600" : "bg-pink-500"
        )}>
          {wishlistCount}
        </span>
      )}
    </Button>
  );
};

export default WishlistSection;
