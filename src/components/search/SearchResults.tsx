
import React from 'react';
import SearchProductCard, { SearchPageProduct } from './SearchProductCard';
import SearchHeader from './SearchHeader';
import SearchPagination from './SearchPagination';
import SearchLoadingState from './SearchLoadingState';
import SearchErrorState from './SearchErrorState';
import SearchEmptyState from './SearchEmptyState';

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  products: SearchPageProduct[];
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  handleAddToCart: (product: SearchPageProduct) => void;
  handleAddToWishlist: (product: SearchPageProduct) => void;
  handleShareProduct: (product: SearchPageProduct) => void;
  onProductClick?: (product: SearchPageProduct) => void;
  onRetry?: () => void;
  totalItems?: number;
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
  isAddingToCart,
  isAddingToWishlist,
  handleAddToCart,
  handleAddToWishlist,
  handleShareProduct,
  onProductClick,
  onRetry,
  totalItems = 0,
  currentPage = 1,
  onPageChange = () => {},
  itemsPerPage = 20,
  onItemsPerPageChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {}
}) => {
  if (loading) {
    return <SearchLoadingState />;
  }
  
  if (error) {
    return <SearchErrorState error={error} onRetry={onRetry} />;
  }
  
  if (products.length === 0) {
    return <SearchEmptyState />;
  }
  
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  return (
    <div className="space-y-6">
      <SearchHeader 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onItemsPerPageChange={onItemsPerPageChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />
      
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        : "flex flex-col space-y-4"
      }>
        {products.map(product => (
          <SearchProductCard
            key={product.id}
            product={product}
            isAddingToCart={isAddingToCart === product.id}
            isAddingToWishlist={isAddingToWishlist === product.id}
            onAddToCart={() => handleAddToCart(product)}
            onAddToWishlist={() => handleAddToWishlist(product)}
            onShare={() => handleShareProduct(product)}
            onClick={onProductClick ? () => onProductClick(product) : undefined}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      <SearchPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SearchResults;
