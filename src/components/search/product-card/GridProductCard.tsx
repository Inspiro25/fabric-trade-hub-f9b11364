
import React from 'react';
import { Heart, ShoppingCart, Share2, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ProductCardBaseProps } from './types';
import { cn } from '@/lib/utils';

export const GridProductCard: React.FC<ProductCardBaseProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  buttonColor // Include buttonColor in the props
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

  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onShare) onShare(product);
  };
    
  return (
    <motion.div 
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-100"
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
            <div className="flex gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-full">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full"
                onClick={handleAddToWishlistClick}
              >
                <Heart className={`h-4 w-4 ${isAddingThisToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full"
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
            <Badge variant="outline" className="bg-purple-500/20 text-purple-800 border-purple-200">
              <Zap className="h-3 w-3 mr-1 text-purple-600" /> Trending
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-3">
        {product.brand && (
          <h4 className="text-sm font-medium text-gray-900 mb-1 uppercase">{product.brand}</h4>
        )}
        
        <h3 className="text-sm font-medium line-clamp-1 text-gray-700">{product.name}</h3>
        
        <div className="flex items-center mt-1 mb-2">
          {product.rating && (
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 mr-1 fill-amber-500" />
              <span className="text-xs">{product.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({product.review_count || 0})</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-[#9b87f5]">
                  ${product.sale_price}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold">
                ${product.price}
              </span>
            )}
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={handleAddToCartClick}
          disabled={!!isAddingThisToCart}
          className={cn("w-full h-9", buttonColor || "bg-[#9b87f5] hover:bg-[#7E69AB]")}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          ADD TO BAG
        </Button>
      </div>
    </motion.div>
  );
};
