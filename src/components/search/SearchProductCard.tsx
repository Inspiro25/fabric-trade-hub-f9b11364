
import React from 'react';
import { Heart, ShoppingCart, Share2, Star, Award, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  shop_id: string;
  is_new?: boolean;
  is_trending?: boolean;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  review_count?: number;
  stock?: number;
}

interface SearchProductCardProps {
  product: SearchPageProduct;
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShare: (product: SearchPageProduct) => void;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  viewMode = 'grid',
  isCompact = false
}) => {
  const isAddingThisToCart = isAddingToCart === product.id;
  const isAddingThisToWishlist = isAddingToWishlist === product.id;
  const discountPercent = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;
  
  if (isCompact) {
    return (
      <motion.div 
        className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
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
            
            {product.rating && (
              <span className="text-xs text-amber-500 flex items-center">
                <Star className="h-3 w-3 mr-0.5 fill-amber-500" />
                {product.rating}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (viewMode === 'list') {
    return (
      <motion.div 
        className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-100"
        whileHover={{ scale: 1.01 }}
        onClick={onClick}
      >
        <div className="flex">
          <div className="w-32 sm:w-48 h-32 flex-shrink-0 relative">
            <img 
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {product.sale_price && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                {discountPercent}% Off
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
                
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.is_new && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      <Award className="h-3 w-3 mr-1" /> New
                    </Badge>
                  )}
                  
                  {(product.stock && product.stock > 0) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      <Truck className="h-3 w-3 mr-1" /> Fast Delivery
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
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(product);
                    }}
                    disabled={isAddingThisToWishlist}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Heart className={`h-4 w-4 ${isAddingThisToWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={isAddingThisToCart}
                    className="h-8 bg-[#9b87f5] hover:bg-[#7E69AB]"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Grid View (default)
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

export default SearchProductCard;

export const SearchProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
    <AspectRatio ratio={1}>
      <Skeleton className="w-full h-full" />
    </AspectRatio>
    
    <div className="p-4">
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-3" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);
