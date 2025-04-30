
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product } from '@/lib/products/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Export the type so it can be used in other files
export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  category_id?: string;
  shop_id?: string;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_trending?: boolean;
  description?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  tags?: string[];
}

export interface ProductCardProps {
  product: SearchPageProduct;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  viewMode: 'grid' | 'list';
  buttonColor?: string;
  isCompact?: boolean;
}

export const SearchProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  viewMode,
  buttonColor = "",
  isCompact = false
}) => {
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

  const hasDiscount = sale_price !== undefined && sale_price !== null;
  const discountedPrice = hasDiscount ? sale_price : price;

  return (
    <Card
      className={cn(
        "border-none shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer",
        viewMode === 'list' ? "flex flex-col md:flex-row items-center" : "",
      )}
      onClick={onClick}
    >
      <div className={cn(
        "relative",
        viewMode === 'list' ? "md:w-1/3" : ""
      )}>
        <img
          src={images[0]}
          alt={name}
          className={cn(
            "w-full h-48 object-cover rounded-t-md",
            viewMode === 'list' ? "rounded-l-md rounded-t-none" : ""
          )}
        />
        {is_new && (
          <Badge className="absolute top-2 left-2">New</Badge>
        )}
        {is_trending && (
          <Badge className="absolute top-2 right-2 bg-blue-500 text-white">Trending</Badge>
        )}
      </div>

      <CardContent className={cn(
        "p-3 space-y-1",
        viewMode === 'list' ? "md:w-2/3" : ""
      )}>
        <h3 className="text-sm font-medium truncate">{name}</h3>
        <p className="text-xs text-gray-500 truncate">{category_id}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">{formatCurrency(discountedPrice)}</span>
            {hasDiscount && (
              <span className="text-gray-500 line-through ml-2">{formatCurrency(price)}</span>
            )}
          </div>
          {rating && review_count && (
            <div className="text-xs text-gray-500">
              {rating} ({review_count})
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist?.();
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          {!isCompact && (
            <Button
              className={cn("text-xs font-medium", buttonColor)}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const SearchProductCardSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  return (
    <Card className={cn(
      "border-none shadow-sm",
      viewMode === 'list' ? "flex flex-col md:flex-row items-center" : ""
    )}>
      <div className={cn(
        "relative",
        viewMode === 'list' ? "md:w-1/3" : ""
      )}>
        <Skeleton className={cn(
          "w-full h-48 rounded-t-md",
          viewMode === 'list' ? "rounded-l-md rounded-t-none" : ""
        )} />
      </div>

      <CardContent className={cn(
        "p-3 space-y-1",
        viewMode === 'list' ? "md:w-2/3" : ""
      )}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>

        <div className="flex items-center justify-end gap-2 mt-2">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button className="text-xs font-medium">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
