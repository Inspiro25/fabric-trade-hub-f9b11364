
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from "sonner";
import { Product } from '@/lib/products/types';
import { useTheme } from '@/contexts/ThemeContext';

interface CompactProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const { isDarkMode } = useTheme();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorited = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product.id);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product, 1, product.colors[0] || '', product.sizes[0] || '');
      toast.success(`Added ${product.name} to cart`);
    }
  };

  const discountPercentage = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <Link to={`/product/${product.id}`} className={cn(
      "block rounded-lg overflow-hidden border",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    )}>
      <div className="flex h-[85px]">
        <div className="w-[85px] h-[85px] relative">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.salePrice && (
            <div className="absolute bottom-0 left-0 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="flex-1 p-1.5 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className={cn(
              "text-xs font-medium line-clamp-1 mb-0.5",
              isDarkMode && "text-white"
            )}>
              {product.name}
            </h3>
            
            <div className="flex items-center text-[10px] mb-1">
              {product.rating > 0 && (
                <div className="flex items-center">
                  <span className="text-green-600 font-medium flex items-center">
                    {product.rating.toFixed(1)}
                  </span>
                  <Star className="h-2 w-2 text-yellow-500 ml-0.5" />
                  <span className={cn(
                    "ml-0.5",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    ({product.reviewCount})
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {product.salePrice ? (
                <>
                  <span className={cn(
                    "text-xs font-semibold",
                    isDarkMode ? "text-blue-400" : "text-gray-900"
                  )}>
                    ₹{product.salePrice.toFixed(2)}
                  </span>
                  <span className={cn(
                    "ml-1 text-[8px] line-through",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    ₹{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className={cn(
                  "text-xs font-semibold",
                  isDarkMode && "text-gray-200"
                )}>
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 p-0"
                onClick={toggleWishlist}
              >
                <Heart className={cn(
                  "h-3 w-3", 
                  isFavorited ? "fill-red-500 text-red-500" : isDarkMode ? "text-gray-400" : "text-gray-500"
                )} />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-5 w-5 p-0",
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
                )}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompactProductCard;
