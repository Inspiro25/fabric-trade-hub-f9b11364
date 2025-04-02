
// Update to use formatCurrency for all price displays
import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { ProductCardBaseProps } from '@/components/search/product-card/types';

export function GridProductCard({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  buttonColor,
}: ProductCardBaseProps) {
  const {
    id,
    name,
    price,
    sale_price,
    images,
    category_id,
    rating,
    review_count,
    is_new,
    is_trending,
  } = product;

  const hasDiscount = sale_price !== undefined && sale_price !== null && sale_price > 0;
  const discountedPrice = hasDiscount ? sale_price : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(product);
    }
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-md border border-border h-full transition-all cursor-pointer hover:shadow-md"
      onClick={handleClick}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-background">
        {images && images[0] ? (
          <img
            src={images[0]}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-400">No image</span>
          </div>
        )}
        
        {is_new && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">New</Badge>
        )}
        
        {is_trending && (
          <Badge className="absolute top-2 right-2 bg-orange-500 text-white">Trending</Badge>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-3 gap-1">
        <h3 className="line-clamp-2 text-sm font-medium text-card-foreground transition-colors">{name}</h3>
        
        {category_id && (
          <span className="text-xs text-muted-foreground">{category_id}</span>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className={cn(
              "font-semibold",
              hasDiscount ? "text-red-600" : "text-card-foreground"
            )}>
              {typeof discountedPrice === 'number' ? formatCurrency(discountedPrice) : formatCurrency(0)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {typeof price === 'number' ? formatCurrency(price) : formatCurrency(0)}
              </span>
            )}
          </div>
          
          {rating !== undefined && review_count !== undefined && (
            <div className="flex items-center text-xs text-amber-500">
              <span className="mr-1">★</span>
              <span>{typeof rating === 'number' ? rating.toFixed(1) : '0.0'}</span>
              <span className="ml-1 text-muted-foreground">({review_count})</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 h-9 text-xs font-medium",
              buttonColor
            )}
            disabled={isAddingToCart === id}
          >
            {isAddingToCart === id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <>
                <ShoppingCart className="mr-1 h-4 w-4" />
                Add
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist === id}
          >
            {isAddingToWishlist === id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
