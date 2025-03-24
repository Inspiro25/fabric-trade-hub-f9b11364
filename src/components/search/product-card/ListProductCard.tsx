
import React from 'react';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { SearchPageProduct } from '@/hooks/search/types';

interface ListProductCardProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
}

export const ListProductCard: React.FC<ListProductCardProps> = ({
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
      className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col md:flex-row"
      onClick={handleClick}
    >
      <div className="relative md:w-1/3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 md:h-full object-cover"
        />
        {product.is_new && (
          <Badge className="absolute top-2 left-2">New</Badge>
        )}
        {product.is_trending && (
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white">Trending</Badge>
        )}
      </div>

      <CardContent className="p-4 md:w-2/3 flex flex-col space-y-2">
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category_id}</p>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {product.colors && product.colors.map(color => (
            <span key={color} className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full">{color}</span>
          ))}
          {product.sizes && product.sizes.map(size => (
            <span key={size} className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full">{size}</span>
          ))}
        </div>
        
        <p className="text-sm line-clamp-2 text-gray-600">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-lg font-bold">{formatCurrency(product.sale_price || product.price)}</span>
            {product.sale_price && (
              <span className="text-gray-500 line-through ml-2">{formatCurrency(product.price)}</span>
            )}
          </div>
          {product.rating && product.review_count && (
            <div className="text-sm text-gray-500">
              {product.rating.toFixed(1)} ({product.review_count} reviews)
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            disabled={isWishlisting}
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4 mr-1" />
            Wishlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button
            className={cn("h-8", buttonColor)}
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
