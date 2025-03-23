
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SearchPageProduct } from '@/hooks/search/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: SearchPageProduct;
  variant?: 'default' | 'compact';
}

const SearchProductCard: React.FC<ProductCardProps> = ({ 
  product,
  variant = 'default'
}) => {
  const { isDarkMode } = useTheme();
  
  if (variant === 'compact') {
    return (
      <Link to={`/product/${product.id}`}>
        <Card className={cn(
          "h-28 overflow-hidden border",
          isDarkMode ? "bg-gray-800 border-gray-700" : "border-gray-200 hover:shadow-md"
        )}>
          <div className="flex h-full">
            <div className="w-28 h-full">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="flex-1 p-3">
              <h3 className={cn(
                "text-sm font-medium line-clamp-1",
                isDarkMode ? "text-gray-100" : "text-gray-800"
              )}>
                {product.name}
              </h3>
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-sm font-bold",
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                )}>
                  {formatCurrency(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="text-xs line-through text-gray-400 ml-2">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 text-yellow-400 mr-1" />
                  <span>{product.rating} ({product.reviewCount})</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }
  
  return (
    <Link to={`/product/${product.id}`}>
      <Card className={cn(
        "overflow-hidden border transition-all hover:-translate-y-1 duration-300",
        isDarkMode ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-700/30" : "border-gray-200 hover:shadow-lg"
      )}>
        <div className="relative aspect-square">
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">New</Badge>
          )}
          {product.salePrice && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full", 
              isDarkMode ? "bg-gray-900/50 text-white hover:text-rose-400" : "bg-white/50 hover:bg-white hover:text-rose-500"
            )}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-3">
          <h3 className={cn(
            "text-sm font-medium line-clamp-2",
            isDarkMode ? "text-gray-100" : "text-gray-800"
          )}>
            {product.name}
          </h3>
          <div className="flex items-center mt-1 mb-1">
            <span className={cn(
              "text-sm font-bold",
              isDarkMode ? "text-orange-400" : "text-orange-600"
            )}>
              {formatCurrency(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xs line-through text-gray-400 ml-2">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 text-yellow-400 mr-1" />
              <span>{product.rating} ({product.reviewCount})</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const ProductCardSkeleton = ({ variant = 'default' }: { variant?: 'default' | 'compact' }) => {
  if (variant === 'compact') {
    return (
      <div className="h-28 rounded-md overflow-hidden border border-gray-200">
        <div className="flex h-full">
          <Skeleton className="w-28 h-full" />
          <div className="flex-1 p-3">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <div className="flex items-center justify-between mt-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export type { SearchPageProduct };
export { ProductCardSkeleton as SearchProductSkeleton };
export default SearchProductCard;
