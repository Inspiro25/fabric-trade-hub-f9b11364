
import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useProductsData } from '@/hooks/use-products-data';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const MeeshoTrendingProducts = ({ title = "Trending Products", limit = 8, query = {} }) => {
  const { products, isLoading, error } = useProductsData({ ...query, limit });
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <div className="py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "text-center py-8",
        isDarkMode ? "text-gray-300" : "text-gray-700"
      )}>
        Unable to load products. Please try again.
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className={cn(
        "text-2xl font-bold mb-6",
        isDarkMode ? "text-white" : "text-purple-800"
      )}>
        {title}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <Link 
            to={`/products/${product.id}`}
            key={product.id} 
            className={cn(
              "rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md group",
              isDarkMode 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200"
            )}
          >
            <div className="aspect-square relative overflow-hidden">
              {product.images && product.images[0] && (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              
              {product.salePrice && (
                <Badge className={cn(
                  "absolute top-2 right-2",
                  isDarkMode 
                    ? "bg-pink-700" 
                    : "bg-pink-600"
                )}>
                  {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                </Badge>
              )}
            </div>
            
            <div className="p-3">
              <h3 className={cn(
                "font-medium line-clamp-1 mb-1",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-purple-800"
                )}>
                  ₹{product.salePrice || product.price}
                </span>
                
                {product.salePrice && (
                  <span className="text-sm line-through text-gray-500">
                    ₹{product.price}
                  </span>
                )}
              </div>
              
              {product.rating > 0 && (
                <div className="flex items-center mt-2">
                  <div className={cn(
                    "flex items-center px-2 py-0.5 rounded text-xs",
                    isDarkMode 
                      ? "bg-green-900/60 text-green-300" 
                      : "bg-green-100 text-green-700"
                  )}>
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {product.rating.toFixed(1)}
                  </div>
                  
                  <span className="text-xs text-gray-500 ml-2">
                    {product.reviewCount} Reviews
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/search" 
          className={cn(
            "inline-block px-4 py-2 rounded-full text-sm font-medium",
            isDarkMode 
              ? "bg-purple-700 text-white hover:bg-purple-800" 
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          )}
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default MeeshoTrendingProducts;
