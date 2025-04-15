
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Star, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductsData } from '@/hooks/use-products-data';

interface ProductGridProps {
  query?: {
    type?: 'trending' | 'new' | 'deals' | 'featured';
    limit?: number;
  };
}

const ProductGrid: React.FC<ProductGridProps> = ({ query = {} }) => {
  const { isDarkMode } = useTheme();
  const { products, isLoading, error } = useProductsData({ ...query, limit: 8 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className={cn(
          "text-lg",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Unable to load products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products?.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className={cn(
            "group rounded-xl overflow-hidden transition-all duration-300",
            isDarkMode 
              ? "bg-gray-800 hover:bg-gray-700" 
              : "bg-white hover:shadow-xl"
          )}
        >
          <div className="aspect-square relative overflow-hidden">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {product.discount > 0 && (
              <Badge
                className={cn(
                  "absolute top-2 right-2",
                  isDarkMode 
                    ? "bg-orange-500" 
                    : "bg-orange-600"
                )}
              >
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          <div className="p-4">
            <h3 className={cn(
              "font-medium line-clamp-2 mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-lg font-bold",
                  isDarkMode 
                    ? "text-orange-400" 
                    : "text-orange-600"
                )}>
                  ${product.salePrice || product.price}
                </span>
                {product.salePrice && (
                  <span className="text-sm line-through text-gray-500">
                    ${product.price}
                  </span>
                )}
              </div>

              {product.rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className={cn(
                    "h-4 w-4",
                    isDarkMode 
                      ? "text-orange-400" 
                      : "text-orange-500"
                  )} />
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
