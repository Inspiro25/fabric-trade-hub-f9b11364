
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '@/hooks/use-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Loader2, Filter, Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import SearchSort from '@/components/search/SearchSort';
import { useSearchFilters } from '@/hooks/use-search-filters';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Define search query interface
interface SearchQuery {
  id: string;
  query: string;
}

const Search = () => {
  const { isDarkMode } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<SearchQuery[]>([]);
  const [, setPopularSearches] = useState<SearchQuery[]>([]);
  
  const { filters, setFilters, clearFilters } = useSearchFilters();
  const [sortOption, setSortOption] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  const searchResult = useSearch(searchQuery, filters, sortOption);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const isMobile = useIsMobile();

  // Extract values from search result
  const { isLoading, error } = searchResult;
  const products = searchResult.products || [];
  const totalProducts = searchResult.totalProducts || 0;

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        const searches = JSON.parse(savedSearches);
        setRecentSearches(searches.map((query: string, index: number) => ({
          id: index.toString(),
          query
        })));
      }
      
      // In a real app, you would fetch popular searches from the server
      const mockPopular = [
        'dress', 'sneakers', 'headphones', 'backpack', 'watch', 'phone case'
      ].map((query, index) => ({ id: index.toString(), query }));
      setPopularSearches(mockPopular);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  }, []);

  // Save recent searches to localStorage whenever it changes
  useEffect(() => {
    try {
      if (recentSearches.length > 0) {
        const searches = recentSearches.map(item => item.query);
        localStorage.setItem('recentSearches', JSON.stringify(searches));
      }
    } catch (error) {
      console.error('Error saving searches:', error);
    }
  }, [recentSearches]);

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Update URL params
    setSearchParams({ q: inputValue.trim() });
    
    // Update search query state
    setSearchQuery(inputValue.trim());
    
    // Add to recent searches if not already there
    const normalizedQuery = inputValue.trim().toLowerCase();
    if (!recentSearches.some(s => s.query.toLowerCase() === normalizedQuery)) {
      const newSearch = { id: Date.now().toString(), query: inputValue.trim() };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 9)]);
    }
    
    // Reset to first page
    setCurrentPage(1);
  };

  // Handle adding product to cart
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      images: product.images || [],
    });
    toast.success(`Added ${product.name} to cart`);
  };

  // Handle adding product to wishlist
  const handleAddToWishlist = (product: any) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
    });
    toast.success(`Added ${product.name} to wishlist`);
  };

  // Handle filter changes
  const handleFilterChange = (activeFilters: string[]) => {
    setFilters(activeFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Clear search
  const handleClearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className={cn(
      "min-h-screen pb-6",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Top search bar */}
      <div className={cn(
        "sticky top-0 z-10 px-3 py-3 shadow-sm",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <form onSubmit={handleSearch} className="container mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              className={cn(
                "pl-9 pr-8 h-10", 
                isDarkMode ? "bg-gray-700 border-gray-600" : ""
              )}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" size="sm" className={cn(
            "px-4",
            isMobile ? "hidden" : ""
          )}>
            Search
          </Button>
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={cn(
                isDarkMode ? "border-gray-700 bg-gray-800" : ""
              )}>
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className={cn(
              isDarkMode ? "bg-gray-800 text-white border-gray-700" : ""
            )}>
              <div className="py-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="mt-4">
                  <SearchFilters
                    activeFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </form>
      </div>

      <div className="container mx-auto px-3 py-4">
        {/* Active filters and search info */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            {searchQuery ? (
              <h1 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : ""
              )}>
                Search results for: <span className="font-bold text-primary">{searchQuery}</span>
              </h1>
            ) : (
              <h1 className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : ""
              )}>All Products</h1>
            )}
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {isLoading 
                ? 'Loading...' 
                : `Showing ${totalProducts} products`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className={cn(
                  "text-xs h-8",
                  isDarkMode ? "border-gray-700 bg-gray-800" : ""
                )}
              >
                Clear filters
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
            <Tabs value={viewMode} onValueChange={(v) => handleViewModeChange(v as 'grid' | 'list')}>
              <TabsList className={cn(
                "h-8",
                isDarkMode ? "bg-gray-700" : ""
              )}>
                <TabsTrigger value="grid" className="px-2 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-2 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                    <line x1="3" x2="3.01" y1="6" y2="6" />
                    <line x1="3" x2="3.01" y1="12" y2="12" />
                    <line x1="3" x2="3.01" y1="18" y2="18" />
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <SearchSort activeSortOption={sortOption} onSortChange={handleSortChange} />
          </div>
        </div>

        {/* Active filters */}
        {filters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className={cn(
                  "px-2 py-1 text-xs",
                  isDarkMode ? "bg-gray-700 text-gray-200" : ""
                )}
              >
                {filter}
                <button
                  onClick={() => setFilters(filters.filter((f) => f !== filter))}
                  className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Desktop layout with sidebar */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filters sidebar (desktop only) */}
          {!isMobile && (
            <aside className="w-full md:w-64 shrink-0">
              <Card className={cn(
                "sticky top-20",
                isDarkMode ? "bg-gray-800 border-gray-700" : ""
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : ""
                    )}>Filters</h3>
                    {filters.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <SearchFilters
                    activeFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Main content */}
          <div className="flex-1">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className={cn(
                "text-center py-10",
                isDarkMode ? "text-gray-300" : ""
              )}>
                <p className="text-red-500 mb-2">{error}</p>
                <Button onClick={() => handleSearch()}>Retry</Button>
              </div>
            ) : (
              <>
                {/* Search results */}
                <SearchResults
                  products={products}
                  totalProducts={totalProducts}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  viewMode={viewMode}
                  onViewModeChange={handleViewModeChange}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onShareProduct={() => {}}
                  error=""
                  isLoading={false}
                />

                {/* No results message */}
                {products.length === 0 && !isLoading && !error && (
                  <div className={cn(
                    "text-center py-12 px-4",
                    isDarkMode ? "text-gray-300" : ""
                  )}>
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className={cn(
                      "mb-6",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Try a different search term or adjust your filters.
                    </p>
                    <Button onClick={handleClearSearch}>
                      Clear search
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent searches section */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="mt-8">
            <h2 className={cn(
              "text-lg font-medium mb-3",
              isDarkMode ? "text-white" : ""
            )}>
              Recent searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(item.query);
                    setSearchQuery(item.query);
                    setSearchParams({ q: item.query });
                  }}
                  className={cn(
                    "text-xs h-8",
                    isDarkMode ? "border-gray-700 bg-gray-800 hover:bg-gray-700" : ""
                  )}
                >
                  {item.query}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecentSearches([])}
                className="text-xs h-8"
              >
                Clear history
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
