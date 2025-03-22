
import React, { useState } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';
import { useTheme } from '@/contexts/ThemeContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

export const CompactProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  onClick,
  onAddToCart,
  onAddToWishlist,
  isAddingToCart,
  isAddingToWishlist
}) => {
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
  const { isDarkMode } = useTheme();
  const { isInWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
    
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
    
  return (
    <motion.div 
      className={cn(
        "group relative rounded-lg overflow-hidden transition-all cursor-pointer",
        isDarkMode 
          ? "bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl hover:border-gray-600" 
          : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
      )}
      whileHover={{ y: -5 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AspectRatio ratio={1}>
        <img 
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </AspectRatio>
      
      {product.sale_price && (
        <Badge className={cn(
          "absolute top-2 left-2",
          isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
        )}>
          {discountPercent}% Off
        </Badge>
      )}

      <div className={cn(
        "absolute right-2 top-2",
        isHovered ? "opacity-100" : "opacity-70"
      )}>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full shadow-subtle",
            isDarkMode 
              ? "bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700" 
              : "bg-white/80 backdrop-blur-sm",
            isFavorited && (isDarkMode 
              ? "bg-pink-900/50 hover:bg-pink-900/70" 
              : "bg-pink-50 hover:bg-pink-100")
          )}
          onClick={handleAddToWishlist}
        >
          <Heart 
            className={cn(
              "h-3 w-3 transition-colors", 
              isFavorited && "fill-pink-500 text-pink-500"
            )} 
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>
      
      {isHovered && (
        <div className="absolute inset-x-0 bottom-0 p-2 transition-all duration-300">
          <Button 
            className={cn(
              "w-full rounded-md shadow-subtle text-xs h-8 backdrop-blur-sm",
              isDarkMode 
                ? "bg-gray-800/80 text-gray-100 hover:bg-gray-700/90" 
                : "bg-white/80 text-foreground hover:bg-white/90"
            )}
            onClick={handleAddToCart}
            disabled={!!isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center">
                <span className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Adding...
              </span>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      )}
      
      <div className="p-2">
        <h3 className={cn(
          "text-sm font-medium line-clamp-1",
          isDarkMode ? "text-gray-100" : ""
        )}>{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-bold",
                  isDarkMode ? "text-orange-400" : "text-orange-500"
                )}>
                  ${product.sale_price}
                </span>
                <span className={cn(
                  "text-xs line-through",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className={cn(
                "text-sm font-bold",
                isDarkMode ? "text-gray-100" : ""
              )}>
                ${product.price}
              </span>
            )}
          </div>
          
          {product.rating > 0 && (
            <span className="text-xs text-amber-500 flex items-center">
              <Star className="h-3 w-3 mr-0.5 fill-amber-500" />
              {product.rating}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
