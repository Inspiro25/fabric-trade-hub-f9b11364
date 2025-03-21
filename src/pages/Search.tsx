
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
import SearchProductCard, { SearchProductSkeleton } from '@/components/search/SearchProductCard';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search as SearchIcon, 
  XCircle, 
  Clock, 
  History, 
  TrendingUp,
  Eye,
  ChevronRight,
  Store
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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
    recentlyViewed,
    popularSearches,
    availabilityFilters,
    handleAvailabilityFilterChange,
    brandFilters,
    toggleBrandFilter,
    discountFilters,
    toggleDiscountFilter,
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
    saveSearchHistory,
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
      <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)} className="rounded-full border-[#9b87f5] text-[#9b87f5]">
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Button variant="outline" size="sm" onClick={() => setMobileSortOpen(true)} className="rounded-full border-[#9b87f5] text-[#9b87f5]">
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
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
        {isLoadingHistory ? (
          <div className="p-3 text-center text-gray-500">
            <motion.div 
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-5 w-5" />
            </motion.div>
            <span className="ml-2">Loading suggestions...</span>
          </div>
        ) : (
          <>
            {searchInput && (
              <div className="p-2 border-b">
                <div 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleSelectSuggestion(searchInput)}
                >
                  <SearchIcon className="h-4 w-4 text-[#9b87f5]" />
                  <span className="text-sm">Search for "<span className="font-medium">{searchInput}</span>"</span>
                </div>
              </div>
            )}
            
            {popularSearches.length > 0 && (
              <div className="p-2 border-b">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular Searches</span>
                </div>
                
                <div className="flex flex-wrap gap-2 px-2">
                  {popularSearches.map((term, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100 border-[#9b87f5] text-[#9b87f5]"
                      onClick={() => handleSelectSuggestion(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {searchHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 px-2">
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
    <div className="container mx-auto px-4 py-[20px] md:py-[40px] bg-gray-50">
      {/* Search input */}
      <div className="mb-6">
        <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pr-24 rounded-full border-[#9b87f5] focus:border-[#7E69AB] pl-10 h-12 focus-visible:ring-[#9b87f5]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9b87f5]" />
              
              {searchInput && (
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setSearchInput('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-400 hover:text-[#9b87f5]"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              )}
              
              <Button 
                type="submit" 
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-[#9b87f5] hover:bg-[#7E69AB] h-10 px-4"
              >
                <SearchIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </form>
          
          <SearchSuggestions />
        </div>
      </div>
      
      {/* Search header */}
      {!initialLoad && query && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-1">
              Results for "<span className="text-[#9b87f5]">{query}</span>"
            </h1>
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
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Search history */}
            {searchHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h2 className="font-semibold text-lg mb-4 flex items-center">
                  <History className="h-4 w-4 mr-2 text-[#9b87f5]" />
                  Recent Searches
                </h2>
                <SearchHistory 
                  history={searchHistory}
                  onSelectHistoryItem={handleHistoryItemClick}
                  onClearHistoryItem={handleClearHistoryItem}
                  onClearAllHistory={handleClearAllHistory}
                />
              </div>
            )}
            
            {/* Filters for desktop */}
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2 text-[#9b87f5]" />
                Filters
              </h2>
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
            <div className="space-y-6">
              {/* Search history for mobile */}
              {isMobile && searchHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="font-semibold text-lg mb-2 flex items-center">
                    <History className="h-4 w-4 mr-2 text-[#9b87f5]" />
                    Recent Searches
                  </h2>
                  <SearchHistory 
                    history={searchHistory}
                    onSelectHistoryItem={handleHistoryItemClick}
                    onClearHistoryItem={handleClearHistoryItem}
                    onClearAllHistory={handleClearAllHistory}
                  />
                </div>
              )}
              
              {/* Browse categories */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg flex items-center">
                    <Store className="h-4 w-4 mr-2 text-[#9b87f5]" />
                    Browse Categories
                  </h2>
                  <Button variant="link" className="text-[#9b87f5] p-0 h-auto text-sm" onClick={() => navigate('/categories')}>
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categories.slice(0, 10).map((category) => (
                    <div 
                      key={category.id}
                      className="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:border-[#9b87f5] cursor-pointer transition-all hover:shadow-sm"
                      onClick={() => {
                        handleCategoryChange(category.id);
                        navigate(`/search?category=${category.id}`);
                      }}
                    >
                      <div className="w-12 h-12 bg-[#E5DEFF] rounded-full flex items-center justify-center mb-2">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-6 h-6" />
                        ) : (
                          <Store className="w-5 h-5 text-[#9b87f5]" />
                        )}
                      </div>
                      <span className="text-sm text-center line-clamp-1">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Tabs defaultValue="recommended" className="w-full">
                <TabsList className="w-full mb-4 bg-white border-b rounded-t-lg">
                  <TabsTrigger value="recommended" className="flex-1 data-[state=active]:text-[#9b87f5] data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5]">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Recommended for You
                  </TabsTrigger>
                  <TabsTrigger value="recently-viewed" className="flex-1 data-[state=active]:text-[#9b87f5] data-[state=active]:border-b-2 data-[state=active]:border-[#9b87f5]">
                    <Eye className="h-4 w-4 mr-2" />
                    Recently Viewed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommended" className="bg-white rounded-b-lg shadow-sm p-4 mt-0">
                  <SearchRecommendations 
                    products={recommendations}
                    isAddingToCart={isAddingToCart}
                    isAddingToWishlist={isAddingToWishlist}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onShare={handleShareProduct}
                    onSelectProduct={handleRecommendedProductClick}
                  />
                </TabsContent>
                
                <TabsContent value="recently-viewed" className="bg-white rounded-b-lg shadow-sm p-4 mt-0">
                  {recentlyViewed.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {recentlyViewed.map((product) => (
                        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                          <SearchProductCard
                            product={product}
                            isAddingToCart={isAddingToCart}
                            isAddingToWishlist={isAddingToWishlist}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onShare={handleShareProduct}
                            viewMode="grid"
                            isCompact={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <h3 className="text-lg font-medium mb-1">No recently viewed products</h3>
                      <p className="text-sm">Products you view will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
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
