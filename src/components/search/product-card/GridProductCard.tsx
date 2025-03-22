
import React from 'react';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';

export const GridProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick
}) => {
  const isAddingThisToCart = isAddingToCart === product.id;
  const isAddingThisToWishlist = isAddingToWishlist === product.id;
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
    
  return (
    <motion.div 
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-100"
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <AspectRatio ratio={1}>
        <img 
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
      </AspectRatio>
      
      {product.is_new && (
        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
          New
        </Badge>
      )}
      
      {product.sale_price && (
        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
          {discountPercent}% Off
        </Badge>
      )}
      
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onShare(product);
          }}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="text-base font-medium line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center mt-1 mb-2">
          {product.rating && (
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 mr-1 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({product.review_count || 0})</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#9b87f5]">
                  ${product.sale_price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">
                ${product.price}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            disabled={isAddingThisToWishlist}
            className="h-9 w-9 p-0 flex-shrink-0 rounded-full"
          >
            <Heart className={`h-4 w-4 ${isAddingThisToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAddingThisToCart}
            className="h-9 flex-1 bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
