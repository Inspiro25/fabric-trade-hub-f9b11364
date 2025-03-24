
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  highlight?: string;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  className?: string;
  buttonColor?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  salePrice,
  image,
  images,
  category,
  isNew,
  isTrending,
  rating = 0,
  reviewCount = 0,
  highlight,
  onAddToCart,
  onAddToWishlist,
  className,
  buttonColor,
}) => {
  // Use first image from images array if available, otherwise use image prop
  const displayImage = images && images.length > 0 ? images[0] : image || '/placeholder.svg';
  
  // Calculate discount percentage if there's a sale price
  const discountPercentage = salePrice ? Math.round((1 - salePrice / price) * 100) : 0;

  return (
    <div className={cn(
      "group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden border border-gray-200 dark:border-gray-700",
      className
    )}>
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-blue-500">New</Badge>
        )}
        {isTrending && (
          <Badge className="bg-purple-500">Trending</Badge>
        )}
        {salePrice && (
          <Badge className="bg-red-500">{discountPercentage}% OFF</Badge>
        )}
        {highlight && (
          <Badge className="bg-amber-500">{highlight}</Badge>
        )}
      </div>
      
      {/* Product Link and Image */}
      <Link to={`/product/${id}`} className="block overflow-hidden aspect-square">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      
      {/* Product Info */}
      <div className="p-3">
        {category && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{category}</span>
        )}
        
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-medium text-sm sm:text-base mt-1 truncate dark:text-gray-100">{name}</h3>
        </Link>
        
        {/* Price and Rating */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            {salePrice ? (
              <>
                <span className="font-bold text-sm sm:text-base dark:text-gray-100">
                  ${salePrice}
                </span>
                <span className="text-xs line-through text-gray-500 dark:text-gray-400">
                  ${price}
                </span>
              </>
            ) : (
              <span className="font-bold text-sm sm:text-base dark:text-gray-100">
                ${price}
              </span>
            )}
          </div>
          
          {rating > 0 && (
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs ml-1 dark:text-gray-300">{rating} ({reviewCount})</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={onAddToCart} 
            size="sm" 
            className={cn(
              "w-full text-xs",
              buttonColor
            )}
          >
            <ShoppingCart size={14} className="mr-1" />
            Add to Cart
          </Button>
          
          <Button
            onClick={onAddToWishlist}
            size="icon"
            variant="outline"
            className="h-8 w-8"
          >
            <Heart size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
