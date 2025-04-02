
// Update the reviewCount references to use review_count
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { SearchPageProduct } from '@/hooks/search/types';
import { ProductCardBaseProps } from '@/components/search/product-card/types';

export interface CompactProductCardProps extends ProductCardBaseProps {
  isCompact?: boolean;
}

export function CompactProductCard({
  product,
  onClick,
  viewMode,
  isCompact = true,
}: CompactProductCardProps) {
  const {
    id,
    name,
    price,
    sale_price,
    images,
    rating,
    review_count,
    is_new,
    is_trending,
  } = product;

  const hasDiscount = sale_price !== undefined && sale_price !== null && sale_price > 0;
  const discountedPrice = hasDiscount ? sale_price : price;
  
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-border h-full transition-all cursor-pointer hover:shadow-md",
        viewMode === 'list' ? "flex-row items-center" : ""
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "relative w-full overflow-hidden bg-background",
        viewMode === 'list' ? "w-1/3" : "aspect-square",
      )}>
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
      
      <div className={cn(
        "flex flex-1 flex-col p-3 gap-1",
        viewMode === 'list' ? "w-2/3" : ""
      )}>
        <h3 className="line-clamp-2 text-sm font-medium text-card-foreground transition-colors">{name}</h3>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className={cn(
              "font-semibold",
              hasDiscount ? "text-red-600" : "text-card-foreground"
            )}>
              {formatCurrency(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          
          {rating !== undefined && review_count !== undefined && (
            <div className="flex items-center text-xs text-amber-500">
              <span className="mr-1">★</span>
              <span>{rating.toFixed(1)}</span>
              <span className="ml-1 text-muted-foreground">({review_count})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
