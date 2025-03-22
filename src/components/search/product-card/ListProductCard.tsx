
import React from 'react';
import { Heart, ShoppingCart, Star, Award, Truck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';

export const ListProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onClick
}) => {
  const isAddingThisToCart = isAddingToCart === true || isAddingToCart === product.id;
  const isAddingThisToWishlist = isAddingToWishlist === true || isAddingToWishlist === product.id;
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
  
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
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-100"
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
                <h3 className="text-lg font-medium line-clamp-1">{product.name}</h3>
                
                {product.rating && (
                  <span className="text-amber-500 text-sm flex items-center ml-2">
                    <Star className="h-4 w-4 mr-0.5 fill-amber-500" />
                    {product.rating} 
                    <span className="text-gray-500 ml-1">({product.review_count || 0})</span>
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                {product.brand && (
                  <span className="text-gray-900 font-medium text-sm">{product.brand}</span>
                )}
                <span className="text-gray-500 text-sm line-clamp-1">{product.description}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {product.is_new && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    <Award className="h-3 w-3 mr-1" /> New Season
                  </Badge>
                )}
                
                {(product.stock && product.stock > 0) && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    <Truck className="h-3 w-3 mr-1" /> Free Delivery
                  </Badge>
                )}
                
                {product.is_trending && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                    <Zap className="h-3 w-3 mr-1" /> Trending
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-between items-center mt-2">
              <div>
                {product.sale_price ? (
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-[#9b87f5]">
                      ${product.sale_price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </span>
                    <span className="text-xs text-green-600 ml-1">
                      {discountPercent}% off
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">
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
                  className="h-9 w-9 p-0 rounded-full border-gray-300"
                >
                  <Heart className={`h-4 w-4 ${isAddingThisToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button 
                  size="sm"
                  variant="default"
                  onClick={handleAddToCartClick}
                  disabled={!!isAddingThisToCart}
                  className="h-9 bg-[#9b87f5] hover:bg-[#7E69AB]"
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
