
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import SearchHistory from '@/components/search/SearchHistory';
import SearchRecommendations from '@/components/search/SearchRecommendations';
import { ArrowLeft, Filter, History } from 'lucide-react';
import { SearchPageProduct } from '@/hooks/search/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useSearchCartIntegration } from '@/hooks/search/use-search-cart-integration';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { useSearchViewMode } from '@/hooks/search/use-search-filters';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProductsBySearch } from '@/hooks/use-product-fetching';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchHistoryItem {
  query: string;
  searched_at: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { isDarkMode } = useTheme();
  const [initialLoad, setInitialLoad] = useState(true);
  const { viewMode, setViewMode } = useSearchViewMode();
  const isMobile = useIsMobile();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Fetch products using hook from use-product-fetching.ts
  const { 
    data: searchData,
    isLoading,
    error
  } = useProductsBySearch(query, currentPage, itemsPerPage);
  
  const products = searchData?.products || [];
  const totalProducts = searchData?.total || 0;
  
  // Use the search cart integration
  const { 
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct
  } = useSearchCartIntegration();
  
  // Use search modal dialogs
  const { LoginDialog, ShareDialog } = useSearchDialogs();
  
  // Scroll to top when query changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);
  
  // Load search history from Supabase
  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          const { data, error } = await supabase
            .from('search_history')
            .select('query, searched_at')
            .eq('user_id', session.session.user.id)
            .order('searched_at', { ascending: false })
            .limit(10);
            
          if (error) {
            console.error('Error fetching search history:', error);
            return;
          }
          
          setSearchHistory(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch search history:', err);
      }
    };
    
    fetchSearchHistory();
  }, [query]);
  
  // Reset to first page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  
  // Mark initial load as complete after first render
  useEffect(() => {
    setInitialLoad(false);
  }, []);
  
  const handleSearch = (searchQuery: string) => {
    setSearchParams({ q: searchQuery });
    setActiveFilters([]);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1);
  };
  
  const handleHistoryItemClick = (historyItem: SearchHistoryItem) => {
    handleSearch(historyItem.query);
    setIsHistoryOpen(false);
  };
  
  const handleProductClick = (product: SearchPageProduct) => {
    navigate(`/product/${product.id}`);
  };
  
  const handleRetry = () => {
    // Retry the search query
    window.location.reload();
  };
  
  return (
    <div className={cn(
      "min-h-screen pb-16 md:pb-0",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className={isDarkMode ? "text-white" : ""}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <SearchBar 
              initialQuery={query} 
              onSearch={handleSearch} 
              autoFocus={!isMobile}
            />
          </div>
          
          <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={isDarkMode ? "text-white" : ""}
              >
                <History className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={cn(isDarkMode ? "bg-gray-800 text-white" : "")}>
              <SheetHeader>
                <SheetTitle className={isDarkMode ? "text-white" : ""}>Search History</SheetTitle>
                <SheetDescription className={isDarkMode ? "text-gray-300" : ""}>
                  Your recent searches
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {searchHistory.length === 0 ? (
                  <p className={cn(
                    "text-center py-8", 
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    No search history found
                  </p>
                ) : (
                  <div className="space-y-2">
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-2 rounded-md cursor-pointer flex items-center justify-between",
                          isDarkMode 
                            ? "hover:bg-gray-700" 
                            : "hover:bg-gray-100"
                        )}
                        onClick={() => handleHistoryItemClick(item)}
                      >
                        <span>{item.query}</span>
                        <span className={cn(
                          "text-xs",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          {new Date(item.searched_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={isDarkMode ? "text-white" : ""}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={cn(isDarkMode ? "bg-gray-800 text-white" : "")}>
              <SheetHeader>
                <SheetTitle className={isDarkMode ? "text-white" : ""}>Filters</SheetTitle>
                <SheetDescription className={isDarkMode ? "text-gray-300" : ""}>
                  Refine your search results
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <SearchFilters 
                  onFilterChange={handleFilterChange} 
                  activeFilters={activeFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(filter => (
              <Badge 
                key={filter}
                variant="secondary"
                className={cn(
                  "px-2 py-1",
                  isDarkMode ? "bg-gray-700 text-white" : ""
                )}
              >
                {filter}
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveFilters([])}
              className={cn(
                "text-xs h-6 px-2",
                isDarkMode ? "text-gray-300 hover:text-white" : ""
              )}
            >
              Clear all
            </Button>
          </div>
        )}
        
        {!query && initialLoad ? (
          <div className="py-8">
            <SearchHistory
              onSelectQuery={handleSearch}
              searchHistory={searchHistory.map(item => item.query)}
            />
          </div>
        ) : (
          <>
            {query && (
              <div className="mb-6">
                <h1 className={cn(
                  "text-xl font-semibold mb-1",
                  isDarkMode ? "text-white" : ""
                )}>
                  {isLoading ? 'Searching...' : (
                    totalProducts > 0 
                      ? `Results for "${query}" (${totalProducts})` 
                      : `No results for "${query}"`
                  )}
                </h1>
                {!isLoading && totalProducts === 0 && !error && (
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Try a different search term or browse our recommendations below.
                  </p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <SearchResults
                products={products}
                loading={isLoading}
                error={error}
                totalProducts={totalProducts}
                isAddingToCart={isAddingToCart}
                isAddingToWishlist={isAddingToWishlist}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShareProduct={handleShareProduct}
                onProductClick={handleProductClick}
                onRetry={handleRetry}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              {!isLoading && totalProducts === 0 && !error && (
                <SearchRecommendations
                  recommendedProducts={[]}
                  isAddingToCart={isAddingToCart}
                  isAddingToWishlist={isAddingToWishlist}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onShareProduct={handleShareProduct}
                  onSelectProduct={(id) => navigate(`/product/${id}`)}
                  title="You might be interested in"
                  emptyStateMessage="No recommendations available"
                />
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Dialogs */}
      <LoginDialog />
      <ShareDialog />
    </div>
  );
};

export default Search;
