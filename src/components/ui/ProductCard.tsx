
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  variant?: string;
  product?: Product;
  layout?: string;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  salePrice,
  image,
  category,
  isNew,
  isTrending,
  rating = 0,
  reviewCount = 0,
  variant,
  product,
  layout,
  onAddToCart,
  onAddToWishlist
}) => {
  // If a full product object is passed, use it for all properties
  const productId = product?.id || id;
  const productName = product?.name || name;
  const productPrice = product?.price || price;
  const productSalePrice = product?.sale_price || salePrice;
  const productImage = product?.images?.[0] || image;
  const productCategory = product?.category || category;
  const productIsNew = product?.is_new || isNew;
  const productIsTrending = product?.is_trending || isTrending;
  const productRating = product?.rating || rating;
  const productReviewCount = product?.review_count || reviewCount;

  // Calculate discount percentage if sale price exists
  const discountPercentage = productSalePrice
    ? Math.round(((productPrice - productSalePrice) / productPrice) * 100)
    : 0;

  const isCompact = variant === 'compact';

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md group h-full",
      isCompact ? "border-0 shadow-none" : ""
    )}>
      <div className="relative">
        <Link to={`/product/${productId}`} className="block">
          <div className={cn(
            "relative aspect-square overflow-hidden bg-gray-100",
            isCompact ? "rounded-md" : ""
          )}>
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {productIsNew && (
            <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">New</Badge>
          )}
          {productIsTrending && (
            <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">Trending</Badge>
          )}
          {productSalePrice && (
            <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">-{discountPercentage}%</Badge>
          )}
        </div>
        
        {/* Quick actions - Only show for non-compact variant */}
        {!isCompact && (
          <div className="absolute right-2 top-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist?.(productId);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
      
      <CardContent className={cn(
        "flex flex-col",
        isCompact ? "p-2" : "p-3"
      )}>
        <Link to={`/product/${productId}`} className="block">
          <h3 className={cn(
            "font-medium line-clamp-1",
            isCompact ? "text-sm" : "text-base"
          )}>
            {productName}
          </h3>
          
          {productCategory && !isCompact && (
            <p className="text-xs text-muted-foreground mt-1">{productCategory}</p>
          )}
          
          <div className="flex items-center mt-1 gap-1">
            {productSalePrice ? (
              <>
                <span className="font-bold text-red-600">${productSalePrice.toFixed(2)}</span>
                <span className="text-sm line-through text-muted-foreground">${productPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${productPrice.toFixed(2)}</span>
            )}
          </div>
          
          {!isCompact && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(productRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">({productReviewCount})</span>
            </div>
          )}
        </Link>
        
        {!isCompact && onAddToCart && (
          <button
            onClick={() => onAddToCart(productId)}
            className="mt-3 text-xs py-1.5 px-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
