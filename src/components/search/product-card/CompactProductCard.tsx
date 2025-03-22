
import React from 'react';
import { Star } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const CompactProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  onClick
}) => {
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
  const { isDarkMode } = useTheme();
    
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(product);
  };
    
  return (
    <motion.div 
      className={cn(
        "group relative rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer",
        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
      )}
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <AspectRatio ratio={1}>
        <img 
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </AspectRatio>
      
      {product.sale_price && (
        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
          {discountPercent}% Off
        </Badge>
      )}
      
      <div className="p-2">
        <h3 className={cn(
          "text-sm font-medium line-clamp-1",
          isDarkMode ? "text-gray-200" : ""
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
                isDarkMode ? "text-white" : ""
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
