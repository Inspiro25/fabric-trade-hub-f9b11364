
import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistSectionProps {
  className?: string;
}

const WishlistSection: React.FC<WishlistSectionProps> = ({ className = "" }) => {
  const { wishlist, isLoading } = useWishlist();
  const wishlistCount = wishlist.length;
  
  if (isLoading) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        className={`relative text-gray-700 ${className}`}
        disabled
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }
  
  return (
    <Button 
      asChild
      variant="ghost" 
      size="icon"
      className={`relative text-gray-700 hover:text-pink-500 transition-colors ${className}`}
    >
      <Link to="/wishlist" aria-label="View your wishlist">
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default WishlistSection;
