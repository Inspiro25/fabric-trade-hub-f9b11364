
import React from 'react';
import SearchProductCard, { SearchPageProduct } from './SearchProductCard';
import SearchHeader from './SearchHeader';
import SearchPagination from './SearchPagination';
import SearchLoadingState from './SearchLoadingState';
import SearchErrorState from './SearchErrorState';
import SearchEmptyState from './SearchEmptyState';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  products: SearchPageProduct[];
  totalProducts: number;
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShareProduct: (product: SearchPageProduct) => void;
  onProductClick?: (product: SearchPageProduct) => void;
  onRetry?: () => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  loading,
  error,
  products,
  totalProducts,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShareProduct,
  onProductClick,
  onRetry,
  currentPage = 1,
  onPageChange = () => {},
  itemsPerPage = 20,
  onItemsPerPageChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {}
}) => {
  const { isDarkMode } = useTheme();
  
  if (loading) {
    return <SearchLoadingState />;
  }
  
  if (error) {
    return <SearchErrorState error={error} onRetry={onRetry} />;
  }
  
  if (products.length === 0) {
    return <SearchEmptyState />;
  }
  
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  
  return (
    <div className={cn(
      "space-y-6",
      isDarkMode && "text-white"
    )}>
      <SearchHeader 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalProducts}
        onItemsPerPageChange={onItemsPerPageChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      
      <motion.div 
        className={viewMode === 'grid' 
          ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
          : "flex flex-col space-y-4"
        }
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.05 }}
      >
        {products.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SearchProductCard
              product={product}
              isAddingToCart={isAddingToCart === product.id}
              isAddingToWishlist={isAddingToWishlist === product.id}
              onAddToCart={() => onAddToCart(product)}
              onAddToWishlist={() => onAddToWishlist(product)}
              onShare={() => onShareProduct(product)}
              onClick={onProductClick ? () => onProductClick(product) : undefined}
              viewMode={viewMode}
              buttonColor={isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <SearchPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchResults;
