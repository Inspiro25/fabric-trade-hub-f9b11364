
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface WishlistSectionProps {
  className?: string;
}

const WishlistSection: React.FC<WishlistSectionProps> = ({ className = "" }) => {
  return (
    <Button 
      asChild
      variant="ghost" 
      size="icon"
      className={`text-gray-700 hover:text-kutuku-primary transition-colors ${className}`}
    >
      <Link to="/wishlist" aria-label="View your wishlist">
        <Heart className="w-5 h-5" />
      </Link>
    </Button>
  );
};

export default WishlistSection;
