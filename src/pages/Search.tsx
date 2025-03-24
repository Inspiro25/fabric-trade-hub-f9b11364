
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/search/product-card';
import { useSearch } from '@/hooks/use-search';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchFilters } from '@/components/search/SearchFilters';
import { useCategories } from '@/hooks/use-categories';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebounce } from '@/hooks/use-debounce';
import { Pagination } from '@/components/ui/pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/utils';
import SearchSort from '@/components/search/SearchSort';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState('relevance');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const searchHistory = useSearchHistory();
  const { isAddingToCart } = useCart();
  const { isAddingToWishlist } = useWishlist();
  
  const { searchResults, isLoading, error, totalResults } = useSearch(
    debouncedSearchQuery,
    page,
    pageSize,
    activeFilters
  );

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
  const removeSearchTerm = searchHistory.clearSearchHistoryItem;

  const applyFilters = () => {
    const filters = [];
    activeCategories.forEach((category) => {
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
      <Helmet>
        <title>Search Products</title>
        <meta name="description" content="Search for products" />
      </Helmet>
      
      <div className={cn(
        "py-6",
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : ""
            )}>Search</h1>
            
            <div className="flex items-center space-x-4">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-64",
                  isDarkMode && "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                )}
              />
              <Button 
                onClick={clearSearchHistory}
                variant={isDarkMode ? "outline" : "secondary"}
                className={isDarkMode ? "border-gray-700 text-gray-300" : ""}
              >
                Clear History
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            {searchHistory.searchHistory.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardContent className="p-4">
                  <h3 className={cn(
                    "text-lg font-semibold mb-2",
                    isDarkMode ? "text-gray-200" : ""
                  )}>Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.searchHistory.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(item.query)}
                        className={isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" : ""}
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

      <div className={cn(
        "container mx-auto px-4 py-8",
        isDarkMode ? "bg-gray-900 text-gray-100" : ""
      )}>
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
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : ""
              )}>
                {searchQuery ? (
                  <>
                    Results for "{searchQuery}"
                    <span className={cn(
                      "text-sm font-normal ml-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      ({totalResults} products)
                    </span>
                  </>
                ) : 'All Products'}
              </h2>
              
              <SearchSort 
                value={sortOption} 
                onChange={setSortOption} 
              />
            </div>
            
            {isLoading ? (
              <p className={isDarkMode ? "text-gray-300" : ""}>Loading search results...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : searchResults.length === 0 ? (
              <p className={isDarkMode ? "text-gray-300" : ""}>No products found matching your search criteria.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAddingToCart={isAddingToCart === product.id}
                      isAddingToWishlist={isAddingToWishlist === product.id}
                    />
                  ))}
                </div>
                
                {totalResults > pageSize && (
                  <div className="mt-8">
                    <Pagination
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
