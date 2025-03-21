
import React from 'react';
import { Loader2, RefreshCw, ListFilter, Grid, LayoutGrid } from 'lucide-react';
import SearchProductCard, { SearchPageProduct } from './SearchProductCard';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span className="text-lg">Loading products...</span>
      </div>
    );
  }
  
  if (error) {
    const isApiUnavailable = error.includes('API endpoint might be unavailable') || 
                            error.includes('HTML instead of JSON');
    
    return (
      <div className="text-red-500 py-12 text-center">
        <p className="mb-3 font-semibold text-xl">Error: {error}</p>
        <p className="text-sm mb-6">
          {isApiUnavailable 
            ? 'The product API is currently unavailable. This might be because the backend service is down.' 
            : 'Please try refreshing the page or try again later.'}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="flex items-center"
            size="lg"
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
      <div className="text-gray-500 py-12 text-center">
        <p className="mb-3 text-lg font-medium">No products found matching your search criteria.</p>
        <p className="text-sm">Try adjusting your filters or search for something else.</p>
      </div>
    );
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="text-sm text-gray-500">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="20 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => onViewModeChange('list')}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        : "flex flex-col space-y-4"
      }>
        {products.map(product => (
          <SearchProductCard
            key={product.id}
            product={product}
            isAddingToCart={isAddingToCart}
            isAddingToWishlist={isAddingToWishlist}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onShare={handleShareProduct}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.First onClick={() => onPageChange(1)} />
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Previous onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
              </Pagination.Item>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Pagination.Item key={pageNum}>
                    <Pagination.Link 
                      isActive={pageNum === currentPage}
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Link>
                  </Pagination.Item>
                );
              })}
              <Pagination.Item>
                <Pagination.Next onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
              </Pagination.Item>
              <Pagination.Item>
                <Pagination.Last onClick={() => onPageChange(totalPages)} />
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
