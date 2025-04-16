import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  shopId: string;
  brand: string;
  shopName: string;
  categoryId: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  category: string;
  isNew: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  isDarkMode?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  id,
  name,
  price,
  salePrice,
  image,
  category,
  isNew,
  isTrending,
  rating,
  reviewCount,
  isDarkMode: propIsDarkMode,
}) => {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      salePrice,
      image,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${name} added to your cart`,
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(id);
    toast({
      title: "Added to wishlist",
      description: `${name} added to your wishlist`,
    });
  };

  const discountedPrice = salePrice !== null ? salePrice : price;

  return (
    <div className={cn("relative rounded-xl overflow-hidden border", isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white", className)}>
      <Link to={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isNew && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md z-10">
              New
            </div>
          )}
          {isTrending && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md z-10">
              Trending
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className={cn(
            "font-medium line-clamp-2 mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-lg font-bold",
              isDarkMode ? "text-orange-400" : "text-orange-600"
            )}>
              {formatCurrency(discountedPrice)}
            </span>
            {salePrice !== null && (
              <span className="text-sm line-through text-gray-500">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          {rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className={cn(
                "h-4 w-4",
                isDarkMode ? "text-orange-400" : "text-orange-500"
              )} />
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={handleAddToWishlist}
            className={cn(
              "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200",
              isDarkMode ? "text-gray-400 hover:text-orange-400" : "text-gray-600 hover:text-orange-600"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className={cn(
              "bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium",
              isDarkMode ? "bg-orange-400 hover:bg-orange-500 text-gray-900" : ""
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
