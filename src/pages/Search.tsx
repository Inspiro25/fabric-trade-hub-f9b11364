
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/search/product-card';
import { useSearch } from '@/hooks/use-search';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchFilters } from '@/components/search/SearchFilters';
import { Category } from '@/hooks/search/types';
import { useCategories } from '@/hooks/use-categories';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebounce } from '@/hooks/use-debounce';
import { PaginationComponent } from '@/components/ui/pagination-custom';
import { DEFAULT_PAGE_SIZE } from '@/lib/utils';
import SearchSort from '@/components/search/SearchSort';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>(new URLSearchParams(location.search).get('q') || '');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState<string>('relevance');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const searchHistory = useSearchHistory();
  
  // Adding empty objects as fallbacks for missing properties
  const cartContext = useCart();
  const isAddingToCart = cartContext?.isAddingToCart || false;
  
  const wishlistContext = useWishlist();
  const isAddingToWishlist = wishlistContext?.isAddingToWishlist || false;
  
  const { 
    searchResults, 
    isLoading, 
    error, 
    totalResults 
  } = useSearch(debouncedSearchQuery, page, pageSize, activeFilters);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (debouncedSearchQuery) {
      params.set('q', debouncedSearchQuery);
    } else {
      params.delete('q');
    }
    navigate(`?${params.toString()}`, { replace: true });
  }, [debouncedSearchQuery, navigate, location]);

  const clearSearchHistory = searchHistory.clearAllSearchHistory;

  const applyFilters = () => {
    const filters: string[] = [];
    
    activeCategories.forEach(category => {
      filters.push(`category:${category}`);
    });
    
    filters.push(`price:${priceRange[0]}-${priceRange[1]}`);
    
    setActiveFilters(filters);
    setPage(1);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setActiveCategories([]);
    setPriceRange([0, 1000]);
  };

  return (
    <>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Search</h1>
            <div className="flex items-center space-x-4">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button onClick={clearSearchHistory}>Clear History</Button>
            </div>
          </div>
          
          <div className="mt-4">
            {searchHistory.searchHistory.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.searchHistory.map((item) => (
                      <Button 
                        key={item.id} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSearchQuery(item.query)}
                      >
                        {item.query}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <SearchFilters 
              categories={categories}
              activeCategories={activeCategories}
              setActiveCategories={setActiveCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          </div>
          
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchQuery ? (
                  <>
                    Results for "{searchQuery}" 
                    <span className="text-sm font-normal ml-2 text-gray-500">
                      ({totalResults} products)
                    </span>
                  </>
                ) : (
                  'All Products'
                )}
              </h2>
              
              <SearchSort
                value={sortOption}
                onChange={setSortOption}
              />
            </div>
            
            {isLoading ? (
              <p>Loading search results...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : searchResults.length === 0 ? (
              <p>No products found matching your search criteria.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAddingToCart={isAddingToCart}
                      isAddingToWishlist={isAddingToWishlist}
                    />
                  ))}
                </div>
                
                {totalResults > pageSize && (
                  <div className="mt-8">
                    <PaginationComponent
                      currentPage={page}
                      totalItems={totalResults}
                      pageSize={pageSize}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
