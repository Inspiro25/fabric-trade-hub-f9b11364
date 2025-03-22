
import React from 'react';
import { Star } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';

export const CompactProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  onClick
}) => {
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
    
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) onClick(product);
  };
    
  return (
    <motion.div 
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
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
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#9b87f5]">
                  ${product.sale_price}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold">
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
