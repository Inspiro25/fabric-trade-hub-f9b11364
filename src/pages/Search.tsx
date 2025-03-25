
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/search/product-card';
import { useSearch } from '@/hooks/use-search';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchFilters } from '@/components/search/SearchFilters';
import { useCategories } from '@/hooks/use-categories';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useDebounce } from '@/hooks/use-debounce';
import { DEFAULT_PAGE_SIZE } from '@/lib/utils';
import SearchSort from '@/components/search/SearchSort';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';
import { Pagination } from '@/components/ui/pagination';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState('relevance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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
    if (isMobile) {
      setIsFiltersOpen(false);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setActiveCategories([]);
    setPriceRange([0, 1000]);
  };

  const FiltersComponent = () => (
    <SearchFilters
      categories={categories}
      activeCategories={activeCategories}
      setActiveCategories={setActiveCategories}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      applyFilters={applyFilters}
      clearFilters={clearFilters}
    />
  );

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className={cn(
              "text-xl md:text-2xl font-bold",
              isDarkMode ? "text-white" : ""
            )}>Search</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full sm:w-64",
                  isDarkMode && "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                )}
              />
              {searchHistory.searchHistory.length > 0 && (
                <Button 
                  onClick={clearSearchHistory}
                  variant={isDarkMode ? "outline" : "secondary"}
                  className={cn(
                    "text-sm",
                    isDarkMode ? "border-gray-700 text-gray-300" : ""
                  )}
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            {searchHistory.searchHistory.length > 0 && (
              <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                <CardContent className="p-4">
                  <h3 className={cn(
                    "text-sm font-semibold mb-2",
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
        "container mx-auto px-4 pb-12",
        isDarkMode ? "bg-gray-900 text-gray-100" : ""
      )}>
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile filters */}
          {isMobile ? (
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  className={cn(
                    "mb-4 w-full",
                    isDarkMode && "bg-gray-800 border-gray-700 text-white"
                  )}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter Products
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className={cn(
                  "w-[85vw] sm:w-[385px] pt-6",
                  isDarkMode && "bg-gray-800 border-gray-700 text-white"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFiltersOpen(false)}
                    className={isDarkMode ? "text-gray-300 hover:bg-gray-700" : ""}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FiltersComponent />
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden lg:block w-full lg:w-1/4 sticky top-4">
              <div className={cn(
                "p-4 rounded-lg border",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <h2 className={cn(
                  "text-lg font-semibold mb-4",
                  isDarkMode && "text-white"
                )}>
                  Filters
                </h2>
                <FiltersComponent />
              </div>
            </div>
          )}
          
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className={cn(
                "text-xl font-bold",
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
              <div className="flex justify-center py-12">
                <div className={cn(
                  "animate-spin rounded-full h-10 w-10 border-b-2",
                  isDarkMode ? "border-orange-500" : "border-orange-400"
                )}></div>
              </div>
            ) : error ? (
              <div className={cn(
                "p-4 rounded-lg",
                isDarkMode ? "bg-red-900/30 text-red-300 border border-red-800" : "bg-red-50 text-red-600"
              )}>
                {error}
              </div>
            ) : searchResults.length === 0 ? (
              <div className={cn(
                "text-center py-12 rounded-lg",
                isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white"
              )}>
                <p className="mb-4">No products found matching your search criteria.</p>
                <Button 
                  onClick={clearFilters}
                  className={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode="grid"
                      isAddingToCart={isAddingToCart === product.id}
                      isAddingToWishlist={isAddingToWishlist === product.id}
                      buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : ""}
                    />
                  ))}
                </div>
                
                {totalResults > pageSize && (
                  <div className="mt-8 flex justify-center">
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
