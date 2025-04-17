import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardBaseProps } from '@/hooks/search/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export const CompactProductCard: React.FC<ProductCardBaseProps> = ({
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
    <div 
      className={cn(
        "group relative rounded-lg shadow-sm overflow-hidden cursor-pointer border flex",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      )}
      onClick={handleProductClick}
    >
      <div className="w-24 h-24 flex-shrink-0">
        <img 
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="p-2 flex flex-col flex-grow">
        <h3 className={cn(
          "text-xs font-medium line-clamp-1 mb-0.5",
          isDarkMode && "text-white"
        )}>
          {product.name}
        </h3>
        
        <div className="flex items-center mb-1">
          {product.rating > 0 && (
            <>
              <span className="text-green-600 text-xs font-medium flex items-center">
                {product.rating.toFixed(1)} <Star className="h-2.5 w-2.5 ml-0.5 text-yellow-500" />
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                ({product.review_count || product.reviewCount || 0})
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center mb-1">
          <span className={cn(
            "text-xs font-semibold",
            isDarkMode ? "text-orange-400" : "text-gray-900"
          )}>
            ₹{(product.sale_price || product.price).toFixed(2)}
          </span>
          {product.sale_price && (
            <span className="ml-1 text-[10px] line-through text-muted-foreground">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="flex gap-1 mt-auto">
          <Button 
            size="sm"
            className={cn(
              "flex-grow h-6 text-[10px] px-1",
              buttonColor || (isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600 text-white")
            )}
            onClick={handleAddToCartClick}
            disabled={isAddingThisToCart}
          >
            {isAddingThisToCart ? 'Adding...' : 'Add to Cart'}
            <ShoppingCart className="ml-1 h-2.5 w-2.5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 p-0"
            onClick={handleAddToWishlistClick}
            disabled={isAddingThisToWishlist}
          >
            <Heart className={cn(
              "h-2.5 w-2.5",
              isAddingThisToWishlist && "text-red-500"
            )} />
          </Button>
        </div>
      </div>
    </div>
  );
};
