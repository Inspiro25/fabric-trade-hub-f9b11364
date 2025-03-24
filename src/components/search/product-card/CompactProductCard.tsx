
import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { SearchPageProduct } from '@/hooks/search/types';

interface CompactProductCardProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onClick?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  buttonColor?: string;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = ({
  product,
  isAddingToCart = false,
  isAddingToWishlist = false,
  onClick,
  onAddToWishlist,
  buttonColor,
}) => {
  const isLoading = typeof isAddingToCart === 'boolean' ? isAddingToCart : isAddingToCart === product.id;
  const isWishlisting = typeof isAddingToWishlist === 'boolean' ? isAddingToWishlist : isAddingToWishlist === product.id;
  
  const handleClick = () => {
    if (onClick) onClick(product);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) onAddToWishlist(product);
  };
  
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        
        {product.is_new && (
          <Badge className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px]">New</Badge>
        )}
        
        <button
          disabled={isWishlisting}
          onClick={handleAddToWishlist}
          className={cn(
            "absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors",
            isWishlisting && "opacity-50"
          )}
        >
          <Heart className="h-3.5 w-3.5 text-gray-700" />
        </button>
      </div>
      
      <div className="px-2 py-1.5 flex-1 flex flex-col">
        <h3 className="text-xs font-medium line-clamp-2">{product.name}</h3>
        
        <div className="mt-auto pt-1 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xs font-semibold">
              {formatCurrency(product.sale_price || product.price)}
            </span>
            {product.sale_price && (
              <span className="ml-1 text-[10px] text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          
          {product.rating && product.review_count > 0 && (
            <div className="flex items-center text-[10px] text-gray-500">
              {product.rating.toFixed(1)} ({product.review_count})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
