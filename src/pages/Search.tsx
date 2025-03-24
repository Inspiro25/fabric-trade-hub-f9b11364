import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSearch } from '@/hooks/use-search';
import { useSearchHistory } from '@/hooks/search/use-search-history';
import { useSearchViewMode, useSearchFilters, useSearchPagination } from '@/hooks/search/use-search-filters';
import { SearchFilters } from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search as SearchIcon, History, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTheme } from '@/contexts/ThemeContext';
import SearchSort from '@/components/search/SearchSort';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const { addToWishlist, isAddingToWishlist } = useWishlist();
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
  const { searchHistory, clearSearchHistory, removeSearchTerm } = useSearchHistory();
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Pagination
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = useSearchPagination();

  // View mode (grid/list)
  const { viewMode, setViewMode } = useSearchViewMode();

  // Filters
  const { activeFilters, toggleFilter, clearFilters } = useSearchFilters();

  // Sort options
  const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Rating', value: 'rating' }
  ];
  
  const [sortOption, setSortOption] = useState('relevance');

  // Fetch search results with all required parameters
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
      navigate({
        search: params.toString()
      }, {
        replace: true
      });
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
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setShowSearchHistory(e.target.value === '');
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setDebouncedQuery(query);
    setShowSearchHistory(false);
  };

  // Handle search history item click
  const handleSearchHistoryClick = (term) => {
    setQuery(term);
    setDebouncedQuery(term);
    setShowSearchHistory(false);
  };

  // Handle product click
  const handleProductClick = (product) => {
    addToRecentlyViewed(product);
    navigate(`/product/${product.id}`);
  };

  // Handle add to cart
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
  }, [addToCart]);

  // Handle add to wishlist
  const handleAddToWishlist = useCallback((product) => {
    addToWishlist(product);
  }, [addToWishlist]);

  // Handle share product
  const handleShareProduct = useCallback((product) => {
    // Implementation depends on your sharing mechanism
    console.log('Share product:', product);
    // Example: Copy link to clipboard
    const productUrl = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard.writeText(productUrl);
    toast({
      title: 'Link copied',
      description: 'Product link copied to clipboard'
    });
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>{debouncedQuery ? `Search: ${debouncedQuery}` : 'Search Products'}</title>
        <meta name="description" content={`Search results for ${debouncedQuery || 'all products'}`} />
      </Helmet>

      <div className={cn("min-h-screen pb-10", isDarkMode ? "bg-gray-900" : "bg-gray-50")}>
        <div className="bg-white py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={query}
                  onChange={handleSearchChange}
                  className="pr-10"
                />
                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
              <Button type="submit" className="ml-3">
                Search
              </Button>
            </form>
            
            {showSearchHistory && searchHistory.length > 0 && (
              <Card className="absolute top-14 left-0 mt-2 w-full z-10">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <History className="h-4 w-4" />
                      Recent Searches
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                      Clear All
                    </Button>
                  </div>
                  <ul>
                    {searchHistory.map((term) => (
                      <li key={term} className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded-md">
                        <button onClick={() => handleSearchHistoryClick(term)} className="flex items-center gap-2 w-full text-left">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {term}
                        </button>
                        <Button variant="ghost" size="icon" onClick={() => removeSearchTerm(term)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="relative mb-6">
            
          </div>
          
          {debouncedQuery && (
            <div className="mb-4">
              <h1 className={cn("text-xl font-semibold mb-1", isDarkMode ? "text-white" : "text-gray-800")}>
                Search results for "{debouncedQuery}"
              </h1>
              <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {isLoading ? 'Searching...' : `Found ${totalResults} results`}
              </p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className={cn("w-full md:w-1/4", isMobile ? "order-2" : "order-1")}>
              <SearchFilters />
            </div>
            
            <div className={cn("flex-1", isMobile ? "order-1" : "order-2")}>
              <div className="flex items-center justify-between mb-4">
                <SearchSort
                  sortOptions={sortOptions}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />
              </div>
              
              <SearchResults
                products={searchResults}
                isLoading={isLoading}
                error={error}
                totalProducts={totalResults}
                isAddingToCart={isAddingToCart as string}
                isAddingToWishlist={isAddingToWishlist as string}
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
