
import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import SearchProductCard, { SearchPageProduct } from './SearchProductCard';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  products: SearchPageProduct[];
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  handleAddToCart: (product: SearchPageProduct) => void;
  handleAddToWishlist: (product: SearchPageProduct) => void;
  handleShareProduct: (product: SearchPageProduct) => void;
  onRetry?: () => void;
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
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading products...
      </div>
    );
  }
  
  if (error) {
    const isApiUnavailable = error.includes('API endpoint might be unavailable') || 
                            error.includes('HTML instead of JSON');
    
    return (
      <div className="text-red-500 py-8 text-center">
        <p className="mb-2 font-semibold">Error: {error}</p>
        <p className="text-sm mb-4">
          {isApiUnavailable 
            ? 'The product API is currently unavailable. This might be because the backend service is down.' 
            : 'Please try refreshing the page or try again later.'}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center">
        <p className="mb-2">No products found matching your search criteria.</p>
        <p className="text-sm">Try adjusting your filters or search for something else.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <SearchProductCard
          key={product.id}
          product={product}
          isAddingToCart={isAddingToCart}
          isAddingToWishlist={isAddingToWishlist}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onShare={handleShareProduct}
        />
      ))}
    </div>
  );
};

export default SearchResults;
