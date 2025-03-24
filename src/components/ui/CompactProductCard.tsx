
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types/product';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface CompactProductCardProps {
  product: Product;
  className?: string;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product, className }) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();

  const isProductInWishlist = product && product.id ? isInWishlist(product.id) : false;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const formattedPrice = product?.price?.toFixed(2);
  const discountedPrice = product?.salePrice ? product.salePrice.toFixed(2) : null;

  return (
    <Link to={`/product/${product.id}`} className={cn(
      "block overflow-hidden rounded-md transition-all hover:shadow-md",
      isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200",
      className
    )}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full",
              isDarkMode 
                ? "bg-gray-900/80 hover:bg-gray-900 text-gray-300" 
                : "bg-white/80 hover:bg-white shadow-sm"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={cn(
                "h-4 w-4", 
                isProductInWishlist 
                  ? "fill-red-500 text-red-500" 
                  : isDarkMode ? "text-gray-300" : "text-gray-600"
              )} 
            />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h3 className={cn(
          "font-medium truncate",
          isDarkMode ? "text-gray-200" : "text-gray-800"
        )}>
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {discountedPrice ? (
              <>
                <span className={cn(
                  "font-medium",
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                )}>
                  ${discountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${formattedPrice}
                </span>
              </>
            ) : (
              <span className={cn(
                "font-medium",
                isDarkMode ? "text-gray-200" : "text-gray-900"
              )}>
                ${formattedPrice}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full",
              isDarkMode 
                ? "bg-orange-600/90 hover:bg-orange-600 text-white" 
                : "bg-orange-100 hover:bg-orange-200 text-orange-600"
            )}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CompactProductCard;
