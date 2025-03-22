
import React from 'react';
import { Heart, ShoppingCart, Star, Award, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const ListProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
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
    
  return (
    <motion.div 
      className={cn(
        "group relative rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      )}
      whileHover={{ scale: 1.01 }}
      onClick={handleProductClick}
    >
      <div className="flex">
        <div className="w-32 sm:w-48 h-32 sm:h-48 flex-shrink-0 relative overflow-hidden">
          <img 
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          {product.sale_price && (
            <Badge className="absolute top-2 left-2 bg-rose-500 hover:bg-rose-600">
              {discountPercent}% OFF
            </Badge>
          )}
          
          {product.is_new && (
            <Badge className="absolute bottom-2 left-2 bg-emerald-500">
              NEW
            </Badge>
          )}
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className={cn(
                  "text-lg font-medium line-clamp-1",
                  isDarkMode ? "text-white" : ""
                )}>{product.name}</h3>
                
                {product.rating && (
                  <span className="text-amber-500 text-sm flex items-center ml-2">
                    <Star className="h-4 w-4 mr-0.5 fill-amber-500" />
                    {product.rating} 
                    <span className={cn(
                      "ml-1",
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    )}>({product.review_count || 0})</span>
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                {product.brand && (
                  <span className={cn(
                    "font-medium text-sm",
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  )}>{product.brand}</span>
                )}
                <span className={cn(
                  "text-sm line-clamp-1",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>{product.description}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {product.is_new && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    isDarkMode 
                      ? "bg-green-900/40 text-green-300 border-green-700" 
                      : "bg-green-50 text-green-700 border-green-200"
                  )}>
                    <Award className="h-3 w-3 mr-1" /> New Season
                  </Badge>
                )}
                
                {(product.stock && product.stock > 0) && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    isDarkMode 
                      ? "bg-blue-900/40 text-blue-300 border-blue-700" 
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  )}>
                    <Truck className="h-3 w-3 mr-1" /> Free Delivery
                  </Badge>
                )}
                
                {product.is_trending && (
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    isDarkMode 
                      ? "bg-orange-900/40 text-orange-300 border-orange-700" 
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  )}>
                    <Zap className="h-3 w-3 mr-1" /> Trending
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-between items-center mt-2">
              <div>
                {product.sale_price ? (
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-orange-400" : "text-orange-500"
                    )}>
                      ${product.sale_price}
                    </span>
                    <span className={cn(
                      "text-sm line-through",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      ${product.price}
                    </span>
                    <span className="text-xs text-green-600 ml-1">
                      {discountPercent}% off
                    </span>
                  </div>
                ) : (
                  <span className={cn(
                    "text-lg font-bold",
                    isDarkMode ? "text-white" : ""
                  )}>
                    ${product.price}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddToWishlistClick}
                  disabled={!!isAddingThisToWishlist}
                  className={cn(
                    "h-9 w-9 p-0 rounded-full",
                    isDarkMode 
                      ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700" 
                      : "border-gray-300"
                  )}
                >
                  <Heart className={cn(
                    "h-4 w-4",
                    isAddingThisToWishlist 
                      ? "fill-red-500 text-red-500" 
                      : isDarkMode ? "text-gray-300" : ""
                  )} />
                </Button>
                
                <Button 
                  size="sm"
                  variant="default"
                  onClick={handleAddToCartClick}
                  disabled={!!isAddingThisToCart}
                  className={cn(
                    "h-9",
                    buttonColor || (isDarkMode 
                      ? "bg-orange-600 hover:bg-orange-700" 
                      : "bg-orange-500 hover:bg-orange-600")
                  )}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  ADD TO BAG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
