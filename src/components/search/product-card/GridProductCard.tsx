import React from 'react';
import { Heart, ShoppingCart, Share2, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from '@/hooks/search/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export const GridProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  buttonColor
}) => {
  const isAddingThisToCart = isAddingToCart === true || isAddingToCart === product.id;
  const isAddingThisToWishlist = isAddingToWishlist === true || isAddingToWishlist === product.id;
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
  const { isDarkMode } = useTheme();
    
  const handleProductClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const handleAddToWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onAddToWishlist) onAddToWishlist(product);
  };

  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onShare) onShare(product);
  };
    
  return (
    <motion.div 
      className={cn(
        "group relative rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border h-full",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      )}
      whileHover={{ y: -5 }}
      onClick={handleProductClick}
    >
      <div className="relative">
        <AspectRatio ratio={1}>
          <img 
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Product badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <Badge className="text-xs bg-green-500 border-none">New</Badge>
            )}
            {product.is_trending && (
              <Badge className="text-xs bg-purple-500 border-none">Trending</Badge>
            )}
            {product.sale_price && discountPercent > 0 && (
              <Badge className="text-xs bg-red-500 border-none">{discountPercent}% OFF</Badge>
            )}
          </div>
        </AspectRatio>
      </div>
      
      <div className="p-3 flex flex-col h-[calc(100%-100%*(1/1))]">
        <div className="flex-grow">
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
          
          <h3 className={cn(
            "font-medium text-sm line-clamp-2 mb-1 min-h-[2.5rem]",
            isDarkMode && "text-white"
          )}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            {product.rating > 0 && (
              <>
                <div className="bg-green-600 text-white text-xs px-1 py-0.5 rounded flex items-center">
                  {product.rating.toFixed(1)} <Star className="h-3 w-3 ml-0.5 fill-white" />
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.review_count || product.reviewCount || 0})
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center mb-3">
            {product.sale_price ? (
              <>
                <span className={cn(
                  "font-semibold",
                  isDarkMode ? "text-orange-400" : "text-gray-900"
                )}>
                  ₹{product.sale_price.toFixed(2)}
                </span>
                <span className="ml-2 text-xs line-through text-muted-foreground">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className={cn(
                "font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-auto flex gap-2">
          <Button 
            className={cn(
              "flex-grow text-xs h-8",
              buttonColor || (isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600 text-white")
            )}
            onClick={handleAddToCartClick}
            disabled={isAddingThisToCart}
          >
            {isAddingThisToCart ? 'Adding...' : 'Add to Cart'}
            <ShoppingCart className="ml-1 h-3 w-3" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleAddToWishlistClick}
            disabled={isAddingThisToWishlist}
          >
            <Heart className={cn(
              "h-3 w-3",
              isAddingThisToWishlist && "text-red-500"
            )} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
