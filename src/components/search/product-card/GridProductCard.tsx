
import React from 'react';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { SearchPageProduct } from '@/hooks/search/types';

interface GridProductCardProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
}

export const GridProductCard: React.FC<GridProductCardProps> = ({
  product,
  isAddingToCart = false,
  isAddingToWishlist = false,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  buttonColor = ""
}) => {
  const isLoading = typeof isAddingToCart === 'boolean' ? isAddingToCart : isAddingToCart === product.id;
  const isWishlisting = typeof isAddingToWishlist === 'boolean' ? isAddingToWishlist : isAddingToWishlist === product.id;
  
  const handleClick = () => {
    if (onClick) onClick(product);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) onAddToWishlist(product);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) onShare(product);
  };
  
  return (
    <Card
      className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.is_new && (
          <Badge className="absolute top-2 left-2">New</Badge>
        )}
        {product.is_trending && (
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white">Trending</Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-1">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 truncate">{product.category_id}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">{formatCurrency(product.sale_price || product.price)}</span>
            {product.sale_price && (
              <span className="text-gray-500 line-through ml-2">{formatCurrency(product.price)}</span>
            )}
          </div>
          {product.rating && product.review_count && (
            <div className="text-xs text-gray-500">
              {product.rating.toFixed(1)} ({product.review_count})
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={isWishlisting}
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button
            className={cn("text-xs font-medium", buttonColor)}
            disabled={isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? "Adding..." : "Add to cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
