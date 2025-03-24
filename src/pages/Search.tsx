
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/hooks/use-search';
import { useSearchHistory } from '@/hooks/search/use-search-history';
import { useSearchViewMode, useSearchFilters } from '@/hooks/search/use-search-filters';
import { useSearchPagination } from '@/hooks/search/use-search-pagination';
import SearchBar from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search as SearchIcon, History, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchPageProduct } from '@/hooks/search/types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import SearchSort from '@/components/search/SearchSort';

export interface SortOption {
  label: string;
  value: string;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  // Search state
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  
  // Search history
  const { searchHistory, clearAllSearchHistory: clearSearchHistory, clearSearchHistoryItem: removeSearchTerm } = useSearchHistory(null);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  
  // Pagination
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = useSearchPagination();
  
  // View mode (grid/list)
  const { viewMode, setViewMode } = useSearchViewMode();
  
  // Filters
  const { activeFilters, toggleFilter, clearFilters } = useSearchFilters();
  
  // Sort options
  const sortOptions: SortOption[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Rating', value: 'rating' },
  ];
  const [sortOption, setSortOption] = useState<string>('relevance');
  
  // Local state for loading indicators
  const [isAddingToCart, setIsAddingToCart] = useState<string | boolean>(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | boolean>(false);
  
  // Fetch search results
  const { searchResults, isLoading, error, totalResults } = useSearch(
    debouncedQuery,
    currentPage,
    itemsPerPage,
    activeFilters
  );
  
  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [debouncedQuery, currentPage, navigate]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, setCurrentPage]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSearchHistory(e.target.value === '');
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
    setShowSearchHistory(false);
  };
  
  // Handle search history item click
  const handleSearchHistoryClick = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setShowSearchHistory(false);
  };
  
  // Handle product click
  const handleProductClick = (product: SearchPageProduct) => {
    addToRecentlyViewed(product.id);
    navigate(`/product/${product.id}`);
  };
  
  // Handle add to cart
  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    
    // Simulate API request
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images
      });
      setIsAddingToCart(false);
      
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    }, 500);
  }, [addToCart, toast]);
  
  // Handle add to wishlist
  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    // Simulate API request
    setTimeout(() => {
      addToWishlist(product.id);
      setIsAddingToWishlist(false);
      
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist`,
      });
    }, 500);
  }, [addToWishlist, toast]);
  
  // Handle share product
  const handleShareProduct = useCallback((product: SearchPageProduct) => {
    // Implementation depends on your sharing mechanism
    console.log('Share product:', product);
    
    // Example: Copy link to clipboard
    const productUrl = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(productUrl);
    
    toast({
      title: 'Link copied',
      description: 'Product link copied to clipboard',
    });
  }, [toast]);
  
  return (
    <>
      <Helmet>
        <title>{debouncedQuery ? `Search: ${debouncedQuery}` : 'Search Products'}</title>
        <meta name="description" content={`Search results for ${debouncedQuery || 'all products'}`} />
      </Helmet>
      
      <div className={cn(
        "min-h-screen pb-10",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="relative mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="search"
                placeholder="Search for products..."
                className={cn(
                  "pl-10 pr-4 py-2 w-full rounded-lg",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" 
                    : "bg-white border-gray-200"
                )}
                value={query}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchHistory(query === '')}
              />
            </form>
            
            {/* Search History Dropdown */}
            {showSearchHistory && Array.isArray(searchHistory) && searchHistory.length > 0 && (
              <Card className={cn(
                "absolute z-10 w-full mt-1 shadow-lg",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}>
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <History size={14} className="mr-1" />
                      <span>Recent Searches</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={clearSearchHistory}
                    >
                      Clear All
                    </Button>
                  </div>
                  <ul>
                    {searchHistory.map((item, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <button
                          className={cn(
                            "flex items-center w-full text-left px-2 py-1.5 rounded-md text-sm",
                            isDarkMode 
                              ? "hover:bg-gray-700 text-gray-200" 
                              : "hover:bg-gray-100 text-gray-700"
                          )}
                          onClick={() => handleSearchHistoryClick(typeof item === 'string' ? item : item.query)}
                        >
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {typeof item === 'string' ? item : item.query}
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSearchTerm(typeof item === 'string' ? item : item.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          {debouncedQuery && (
            <div className="mb-4">
              <h1 className={cn(
                "text-xl font-semibold mb-1",
                isDarkMode ? "text-white" : "text-gray-800"
              )}>
                Search results for "{debouncedQuery}"
              </h1>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {isLoading ? 'Searching...' : `Found ${totalResults} results`}
              </p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filters sidebar */}
            <div className={cn(
              "w-full md:w-64 shrink-0",
              isMobile ? "order-2" : "order-1"
            )}>
              <SearchFilters 
                darkMode={isDarkMode}
                clearFilters={clearFilters}
              />
              
              {/* Recently viewed section */}
              {recentlyViewed.length > 0 && (
                <Card className={cn(
                  "mt-4",
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                )}>
                  <CardContent className="p-3">
                    <h3 className={cn(
                      "text-sm font-medium mb-2",
                      isDarkMode ? "text-white" : "text-gray-800"
                    )}>
                      Recently Viewed
                    </h3>
                    <div className="space-y-2">
                      {recentlyViewed.slice(0, 3).map(product => (
                        <button
                          key={product.id}
                          className={cn(
                            "flex items-center w-full p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          )}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 mr-2">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Main content */}
            <div className={cn(
              "flex-1",
              isMobile ? "order-1" : "order-2"
            )}>
              {/* Sort and view options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <SearchSort
                  options={sortOptions}
                  value={sortOption}
                  onChange={setSortOption}
                />
                
                <div className="flex items-center">
                  <span className={cn(
                    "text-xs mr-2",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Show:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className={cn(
                      "text-xs rounded border px-2 py-1 mr-4",
                      isDarkMode 
                        ? "bg-gray-800 border-gray-700 text-white" 
                        : "bg-white border-gray-200"
                    )}
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
              
              {/* Search results */}
              <SearchResults
                products={searchResults}
                isLoading={isLoading}
                error={error}
                totalProducts={totalResults}
                isAddingToCart={isAddingToCart}
                isAddingToWishlist={isAddingToWishlist}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShareProduct={handleShareProduct}
                onProductClick={handleProductClick}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
