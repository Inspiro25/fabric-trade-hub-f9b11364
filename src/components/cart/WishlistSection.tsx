
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface WishlistSectionProps {
  wishlistProducts: Product[];
  handleMoveToCart: (product: Product) => void;
  isLoaded: boolean;
}

const WishlistSection: React.FC<WishlistSectionProps> = ({ 
  wishlistProducts, 
  handleMoveToCart, 
  isLoaded 
}) => {
  return (
    <div className={`transition-all duration-500 delay-150 mt-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            Your Wishlist ({wishlistProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} variant="compact" />
                  <Button 
                    size="sm" 
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs bg-kutuku-primary hover:bg-kutuku-secondary"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WishlistSection;
