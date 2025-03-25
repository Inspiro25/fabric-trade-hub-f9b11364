
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/products/types';

interface ProductCardProps {
  product?: Product;
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
  layout?: 'vertical' | 'horizontal';
  showWishlistButton?: boolean;
  showRemoveButton?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onRemoveFromWishlist?: () => void;
  isAddingToCart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
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
  layout = 'vertical',
  showWishlistButton = true,
  showRemoveButton = false,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isAddingToCart = false,
}) => {
  const isHorizontal = layout === 'horizontal';
  
  // Calculate discount percentage if sale price exists
  const discountPercentage = salePrice 
    ? Math.round(((price - salePrice) / price) * 100) 
    : 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md h-full",
      isHorizontal && "flex"
    )}>
      <Link 
        to={`/product/${id}`} 
        className={cn(
          "block",
          isHorizontal && "w-1/3"
        )}
      >
        <div className={cn(
          "relative",
          isHorizontal ? "h-full" : "aspect-square"
        )}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/gray/white?text=No+Image';
            }}
          />
          
          {/* Product badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge variant="secondary" className="bg-blue-500 text-white">New</Badge>
            )}
            {isTrending && (
              <Badge variant="secondary" className="bg-purple-500 text-white">Trending</Badge>
            )}
            {salePrice && discountPercentage > 0 && (
              <Badge variant="destructive">-{discountPercentage}%</Badge>
            )}
          </div>
        </div>
      </Link>
      
      <div className={cn(
        "p-3 flex flex-col justify-between",
        isHorizontal && "flex-1"
      )}>
        <div>
          <Link to={`/product/${id}`}>
            <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
            {category && (
              <p className="text-xs text-muted-foreground mt-1">{category}</p>
            )}
          </Link>
          
          <div className="flex items-center mt-2">
            {rating > 0 && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div>
              {salePrice ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-red-600">${salePrice.toFixed(2)}</span>
                  <span className="text-sm line-through text-muted-foreground">${price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-semibold">${price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {showWishlistButton && onAddToWishlist && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToWishlist();
                  }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              )}
              
              {showRemoveButton && onRemoveFromWishlist && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFromWishlist();
                  }}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              )}
              
              {onAddToCart && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart();
                  }}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
