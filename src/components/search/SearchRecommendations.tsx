
import React from 'react';
import { SearchPageProduct } from '@/hooks/search/types';
import { Grid } from 'lucide-react';
import ProductCard from './product-card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export interface SearchRecommendationsProps {
  recommendedProducts: SearchPageProduct[];
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShareProduct?: (product: SearchPageProduct) => void;
  onSelectProduct?: (id: string) => void;
  title?: string;
  emptyStateMessage?: string;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({
  recommendedProducts,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShareProduct,
  onSelectProduct,
  title = 'Recommended for you',
  emptyStateMessage = 'No recommendations available'
}) => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  
  const isAuthenticated = !!currentUser;
  
  if (!recommendedProducts || recommendedProducts.length === 0) {
    return (
      <div className="py-8 text-center">
        <Grid className={cn("h-10 w-10 mx-auto mb-2", isDarkMode ? "text-gray-600" : "text-gray-300")} />
        <h3 className={cn("text-lg font-medium mb-1", isDarkMode ? "text-white" : "text-gray-800")}>{title}</h3>
        <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-500")}>{emptyStateMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <h3 className={cn(
        "text-lg font-medium mb-4",
        isDarkMode ? "text-white" : "text-gray-800"
      )}>{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isAddingToCart={isAddingToCart === product.id}
            isAddingToWishlist={isAddingToWishlist === product.id}
            onAddToCart={() => onAddToCart?.(product)}
            onAddToWishlist={() => onAddToWishlist?.(product)}
            onShare={() => onShareProduct?.(product)}
            onClick={() => onSelectProduct?.(product.id)}
            viewMode="grid"
          />
        ))}
      </div>
    </div>
  );
};

export default SearchRecommendations;
