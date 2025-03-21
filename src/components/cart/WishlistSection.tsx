
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface WishlistSectionProps {
  isLoaded: boolean;
}

const WishlistSection: React.FC<WishlistSectionProps> = ({ isLoaded }) => {
  return (
    <div className={`transition-all duration-500 delay-150 mt-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            Your Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">View your saved items in the wishlist</p>
            <Button 
              asChild
              className="bg-kutuku-primary hover:bg-kutuku-secondary"
            >
              <Link to="/wishlist" className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                View My Wishlist
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistSection;
