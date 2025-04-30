
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchPageProduct } from '@/hooks/search/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchRecommendationsProps {
  title?: string;
  products: SearchPageProduct[];
  className?: string;
  maxItems?: number;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({
  title = 'Recommended for you',
  products,
  className = '',
  maxItems = 4
}) => {
  const { isDarkMode } = useTheme();
  const displayProducts = products.slice(0, maxItems);

  if (!displayProducts.length) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <h3 className={cn(
        "text-lg font-medium mb-3",
        isDarkMode ? "text-gray-200" : "text-gray-800"
      )}>
        {title}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {displayProducts.map((product) => (
          <Link 
            key={product.id}
            to={`/product/${product.id}`}
            className="block"
          >
            <Card className={cn(
              "overflow-hidden h-full border transition-colors",
              isDarkMode 
                ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                : "bg-white hover:border-gray-400"
            )}>
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {(product.salePrice || product.sale_price) && (
                  <span className={cn(
                    "absolute top-2 left-2 text-xs py-1 px-2 rounded-full font-medium",
                    isDarkMode ? "bg-red-600 text-white" : "bg-red-500 text-white"
                  )}>
                    Sale
                  </span>
                )}
              </div>
              
              <CardContent className="p-3">
                <div className="truncate text-sm font-medium">
                  {product.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    {(product.salePrice || product.sale_price) ? (
                      <>
                        <span className={cn(
                          "text-sm font-bold",
                          isDarkMode ? "text-red-400" : "text-red-600"
                        )}>
                          ${(product.salePrice || product.sale_price)?.toFixed(2)}
                        </span>
                        <span className="text-xs line-through ml-2 text-gray-500">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    ★ {product.rating}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchRecommendations;
