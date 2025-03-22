
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/hooks/use-search';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import SearchResults from '@/components/search/SearchResults';
import SearchHistory from '@/components/search/SearchHistory';
import SearchCategories from '@/components/search/SearchCategories';
import SearchRecommendations from '@/components/search/SearchRecommendations';
import ShareDialog from '@/components/search/ShareDialog';
import AuthDialog from '@/components/search/AuthDialog';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, ArrowUpDown, Search as SearchIcon, XCircle, Clock, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setLocalSearchHistory] = useState<{ id: string; query: string }[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { currentUser } = useAuth();

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Search hooks
  const {
    products,
    categories,
    shops,
    loading,
    error,
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    isAddingToCart,
    isAddingToWishlist,
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    searchHistory: hookSearchHistory,
    recommendations,
    initialLoad,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    clearFilters,
    handleLogin,
    fetchData,
    clearSearchHistoryItem,
    clearAllSearchHistory,
  } = useSearch(query);

  // Handle clicks outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search history when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchSearchHistory();
    }
  }, [currentUser]);

  // Fetch search history from database
  const fetchSearchHistory = async () => {
    if (!currentUser) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('searched_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching search history:', error);
        return;
      }
      
      setLocalSearchHistory(data || []);
    } catch (err) {
      console.error('Error fetching search history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Save search query to history
  const saveSearchHistory = async (query: string) => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .upsert(
          { 
            user_id: currentUser.uid,
            query: query.toLowerCase(),
            searched_at: new Date().toISOString() 
          },
          { onConflict: 'user_id,query' }
        );
      
      // Refresh search history
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
      if (currentUser) {
        saveSearchHistory(trimmedSearch);
      }
      setShowSuggestions(false);
    }
  };

  // Handle search suggestion selection
  const handleSelectSuggestion = (selectedQuery: string) => {
    setSearchInput(selectedQuery);
    navigate(`/search?q=${encodeURIComponent(selectedQuery)}`);
    if (currentUser) {
      saveSearchHistory(selectedQuery);
    }
    setShowSuggestions(false);
  };

  // Clear a specific search history item
  const handleClearHistoryItem = async (id: string) => {
    await clearSearchHistoryItem(id);
    setLocalSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  // Clear all search history
  const handleClearAllHistory = async () => {
    await clearAllSearchHistory();
    setLocalSearchHistory([]);
  };

  // Reset pagination when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  
  // Handle category selection from category pills
  const handleCategoryPillClick = (categoryId: string | null) => {
    handleCategoryChange(categoryId);
  };
  
  // Handle search history item selection
  const handleHistoryItemClick = (historyQuery: string) => {
    setSearchInput(historyQuery);
    navigate(`/search?q=${encodeURIComponent(historyQuery)}`);
  };
  
  // Handle clicking on a recommended product
  const handleRecommendedProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Add retry handler function
  const handleRetry = () => {
    fetchData();
  };

  // Paginate products
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Render mobile filter buttons
  const renderMobileFilterButtons = () => (
    <div className="flex items-center space-x-2 self-end md:self-auto">
      <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)}>
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Button variant="outline" size="sm" onClick={() => setMobileSortOpen(true)}>
        <ArrowUpDown className="mr-2 h-4 w-4" />
        Sort
      </Button>
    </div>
  );

  // Render desktop filter buttons
  const renderDesktopFilterButtons = () => (
    <div className="flex items-center space-x-2">
      <SearchFilters 
        isMobile={false} 
        categories={categories} 
        shops={shops} 
        selectedCategory={selectedCategory} 
        selectedShop={selectedShop} 
        priceRange={priceRange} 
        rating={rating} 
        mobileFiltersOpen={mobileFiltersOpen} 
        setMobileFiltersOpen={setMobileFiltersOpen} 
        handleCategoryChange={handleCategoryChange} 
        handleShopChange={handleShopChange} 
        handlePriceRangeChange={handlePriceRangeChange} 
        handleRatingChange={handleRatingChange} 
        clearFilters={clearFilters} 
      />
      <SearchSort 
        isMobile={false} 
        sortOption={sortOption} 
        mobileSortOpen={mobileSortOpen} 
        setMobileSortOpen={setMobileSortOpen} 
        handleSortChange={handleSortChange} 
      />
    </div>
  );

  // Search suggestions component
  const SearchSuggestions = () => {
    if (!showSuggestions) return null;
    
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
        {isLoadingHistory ? (
          <div className="p-3 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            {searchInput && (
              <div className="p-2 border-b">
                <div 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleSelectSuggestion(searchInput)}
                >
                  <SearchIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Search for "{searchInput}"</span>
                </div>
              </div>
            )}
            
            {searchHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <History className="h-3 w-3" />
                    <span>Recent Searches</span>
                  </div>
                  {searchHistory.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearAllHistory}
                      className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                {searchHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <div 
                      className="flex items-center gap-2 text-sm text-gray-700"
                      onClick={() => handleSelectSuggestion(item.query)}
                    >
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>{item.query}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearHistoryItem(item.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-[20px] md:py-[50px]">
      {/* Search input */}
      <div className="mb-6">
        <div ref={searchRef} className="relative w-full max-w-lg mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="pr-20 rounded-full border-kutuku-gray focus:border-kutuku-primary"
            />
            {searchInput && (
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={() => setSearchInput('')}
                className="absolute right-10 top-0 h-full flex items-center justify-center text-kutuku-muted hover:text-kutuku-primary"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full flex items-center justify-center text-kutuku-muted hover:text-kutuku-primary"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>
          
          <SearchSuggestions />
        </div>
      </div>
      
      {/* Search header */}
      {!initialLoad && query && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">Search Results for "{query}"</h1>
            <p className="text-gray-500 text-sm">
              {products.length} {products.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          
          {isMobile ? renderMobileFilterButtons() : renderDesktopFilterButtons()}
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <div className="w-full lg:w-64 shrink-0">
            {/* Search history */}
            {searchHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 mb-6 sticky top-4">
                <h2 className="font-semibold text-lg mb-4">Recent Searches</h2>
                <SearchHistory 
                  history={searchHistory}
                  onSelectHistoryItem={handleHistoryItemClick}
                  onClearHistoryItem={handleClearHistoryItem}
                  onClearAllHistory={handleClearAllHistory}
                />
              </div>
            )}
            
            {/* Filters for desktop */}
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              <SearchFilters 
                isMobile={false} 
                categories={categories} 
                shops={shops} 
                selectedCategory={selectedCategory} 
                selectedShop={selectedShop} 
                priceRange={priceRange} 
                rating={rating} 
                mobileFiltersOpen={mobileFiltersOpen} 
                setMobileFiltersOpen={setMobileFiltersOpen} 
                handleCategoryChange={handleCategoryChange} 
                handleShopChange={handleShopChange} 
                handlePriceRangeChange={handlePriceRangeChange} 
                handleRatingChange={handleRatingChange} 
                clearFilters={clearFilters} 
                expanded={true} 
              />
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Show content based on state */}
          {initialLoad || !query ? (
            <>
              {/* Search history for mobile */}
              {isMobile && searchHistory.length > 0 && (
                <SearchHistory 
                  history={searchHistory}
                  onSelectHistoryItem={handleHistoryItemClick}
                  onClearHistoryItem={handleClearHistoryItem}
                  onClearAllHistory={handleClearAllHistory}
                />
              )}
              
              {/* Category pills */}
              <SearchCategories 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryPillClick}
              />
              
              {/* Recommendations */}
              <SearchRecommendations 
                products={recommendations}
                isAddingToCart={isAddingToCart}
                isAddingToWishlist={isAddingToWishlist}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShare={handleShareProduct}
                onSelectProduct={handleRecommendedProductClick}
              />
            </>
          ) : (
            <>
              {/* Search results */}
              <SearchResults 
                loading={loading} 
                error={error} 
                products={paginatedProducts} 
                isAddingToCart={isAddingToCart} 
                isAddingToWishlist={isAddingToWishlist} 
                handleAddToCart={handleAddToCart} 
                handleAddToWishlist={handleAddToWishlist} 
                handleShareProduct={handleShareProduct} 
                onRetry={handleRetry}
                totalItems={products.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile dialogs */}
      <SearchFilters 
        isMobile={true} 
        categories={categories} 
        shops={shops} 
        selectedCategory={selectedCategory} 
        selectedShop={selectedShop} 
        priceRange={priceRange} 
        rating={rating} 
        mobileFiltersOpen={mobileFiltersOpen} 
        setMobileFiltersOpen={setMobileFiltersOpen} 
        handleCategoryChange={handleCategoryChange} 
        handleShopChange={handleShopChange} 
        handlePriceRangeChange={handlePriceRangeChange} 
        handleRatingChange={handleRatingChange} 
        clearFilters={clearFilters} 
      />
      
      <SearchSort 
        isMobile={true} 
        sortOption={sortOption} 
        mobileSortOpen={mobileSortOpen} 
        setMobileSortOpen={setMobileSortOpen} 
        handleSortChange={handleSortChange} 
      />

      <AuthDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} onLogin={handleLogin} />

      <ShareDialog isOpen={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} shareableLink={shareableLink} />
    </div>
  );
};

export default Search;
