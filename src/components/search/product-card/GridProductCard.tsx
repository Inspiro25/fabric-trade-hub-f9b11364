
import React from 'react';
import { Heart, ShoppingCart, Share2, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';
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
        "group relative rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      )}
      whileHover={{ y: -5 }}
      onClick={handleProductClick}
    >
      <div className="relative">
        <AspectRatio ratio={3/4}>
          <img 
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay with quick actions - Myntra style */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center p-3 opacity-0 group-hover:opacity-100">
            <div className={cn(
              "flex gap-2 p-1 rounded-full",
              isDarkMode ? "bg-gray-800/90" : "bg-white/90"
            )}>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-8 w-8 rounded-full",
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                )}
                onClick={handleAddToWishlistClick}
              >
                <Heart className={cn(
                  "h-4 w-4",
                  isAddingThisToWishlist ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-gray-300' : ''
                )} />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-8 w-8 rounded-full",
                  isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100"
                )}
                onClick={handleShareClick}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AspectRatio>
        
        {product.is_new && (
          <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">
            NEW
          </Badge>
        )}
        
        {product.sale_price && (
          <Badge className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600">
            {discountPercent}% OFF
          </Badge>
        )}
        
        {product.is_trending && (
          <div className="absolute left-2 bottom-2">
            <Badge variant="outline" className={cn(
              isDarkMode 
                ? "bg-orange-900/20 text-orange-300 border-orange-700" 
                : "bg-orange-500/20 text-orange-800 border-orange-200"
            )}>
              <Zap className={cn(
                "h-3 w-3 mr-1",
                isDarkMode ? "text-orange-300" : "text-orange-600"
              )} /> Trending
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-3">
        {product.brand && (
          <h4 className={cn(
            "text-sm font-medium mb-1 uppercase",
            isDarkMode ? "text-gray-200" : "text-gray-900"
          )}>{product.brand}</h4>
        )}
        
        <h3 className={cn(
          "text-sm font-medium line-clamp-1",
          isDarkMode ? "text-gray-200" : "text-gray-700"
        )}>{product.name}</h3>
        
        <div className="flex items-center mt-1 mb-2">
          {product.rating && (
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 mr-1 fill-amber-500" />
              <span className="text-xs">{product.rating}</span>
              <span className={cn(
                "text-xs ml-1",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>({product.review_count || 0})</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-base font-bold",
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
                "text-base font-bold",
                isDarkMode ? "text-white" : ""
              )}>
                ${product.price}
              </span>
            )}
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={handleAddToCartClick}
          disabled={!!isAddingThisToCart}
          className={cn(
            "w-full h-9", 
            buttonColor || (isDarkMode 
              ? "bg-orange-600 hover:bg-orange-700" 
              : "bg-orange-500 hover:bg-orange-600")
          )}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          ADD TO BAG
        </Button>
      </div>
    </motion.div>
  );
};
