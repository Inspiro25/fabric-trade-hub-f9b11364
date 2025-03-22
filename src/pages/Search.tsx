
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearch } from '@/hooks/use-search';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import SearchFilters from '@/components/search/SearchFilters';
import SearchSort from '@/components/search/SearchSort';
import SearchResults from '@/components/search/SearchResults';
import SearchHistory from '@/components/search/SearchHistory';
import SearchCategories from '@/components/search/SearchCategories';
import SearchRecommendations from '@/components/search/SearchRecommendations';
import ShareDialog from '@/components/search/ShareDialog';
import AuthDialog from '@/components/search/AuthDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { cn } from '@/lib/utils';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
    viewMode,
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
    searchHistory,
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
    handleViewModeChange,
    clearFilters,
    handleLogin,
    fetchData,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
  } = useSearch(query);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
      if (currentUser) {
        // Fixed: Only pass the query string (saveSearchHistory was updated to use the userId from state)
        saveSearchHistory(trimmedSearch);
      }
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (selectedQuery: string) => {
    setSearchInput(selectedQuery);
    navigate(`/search?q=${encodeURIComponent(selectedQuery)}`);
    if (currentUser) {
      // Fixed: Only pass the query string (saveSearchHistory was updated to use the userId from state)
      saveSearchHistory(selectedQuery);
    }
    setShowSuggestions(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchData();
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const SearchSuggestions = () => {
    if (!showSuggestions) return null;
    
    return (
      <div className={cn(
        "absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      )}>
        {searchInput && (
          <div className="p-2 border-b dark:border-gray-700">
            <div 
              className={cn(
                "flex items-center gap-2 p-2 rounded cursor-pointer",
                isDarkMode 
                  ? "hover:bg-orange-900/30" 
                  : "hover:bg-orange-50"
              )}
              onClick={() => handleSelectSuggestion(searchInput)}
            >
              <SearchIcon className="h-4 w-4 text-kutuku-primary" />
              <span className={cn(
                "text-sm",
                isDarkMode ? "text-gray-200" : ""
              )}>
                Search for "<span className="font-medium">{searchInput}</span>"
              </span>
            </div>
          </div>
        )}
        
        {popularSearches.length > 0 && (
          <div className="p-2 border-b dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
              <TrendingUp className="h-3 w-3" />
              <span>Popular Searches</span>
            </div>
            
            <div className="flex flex-wrap gap-2 px-2">
              {popularSearches.map((term, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className={cn(
                    "cursor-pointer border-kutuku-primary text-kutuku-primary",
                    isDarkMode 
                      ? "hover:bg-orange-900/30 border-orange-700" 
                      : "hover:bg-orange-50"
                  )}
                  onClick={() => handleSelectSuggestion(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {searchHistory && searchHistory.length > 0 && (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
                <History className="h-3 w-3" />
                <span>Recent Searches</span>
              </div>
              {searchHistory.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllSearchHistory}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-6 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {searchHistory.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded cursor-pointer",
                  isDarkMode 
                    ? "hover:bg-orange-900/30" 
                    : "hover:bg-orange-50"
                )}
              >
                <div 
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => handleSelectSuggestion(item.query)}
                >
                  <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                  <span>{item.query}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSearchHistoryItem(item.id);
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const backgroundClass = isDarkMode 
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
    : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white";

  return (
    <div className={cn(
      "min-h-screen py-[16px] md:py-[32px]",
      backgroundClass
    )}>
      <div className="container mx-auto px-4">
        <div className="mb-5">
          <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className={cn(
                    "pr-16 rounded-full pl-10 h-10 sm:h-12",
                    isDarkMode 
                      ? "border-kutuku-primary focus:border-kutuku-secondary focus-visible:ring-kutuku-primary bg-gray-800 text-gray-200" 
                      : "border-kutuku-primary focus:border-kutuku-secondary focus-visible:ring-kutuku-primary"
                  )}
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-kutuku-primary" />
                
                {searchInput && (
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setSearchInput('')}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center text-gray-400 hover:text-kutuku-primary"
                  >
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-kutuku-primary hover:bg-kutuku-secondary h-8 sm:h-10 px-2 sm:px-4"
                >
                  <SearchIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">Search</span>
                </Button>
              </div>
            </form>
            
            <SearchSuggestions />
          </div>
        </div>
        
        {!initialLoad && query && (
          <div className={cn(
            "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 p-3 md:p-4 rounded-lg shadow-sm",
            isDarkMode 
              ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" 
              : "bg-white"
          )}>
            <div>
              <h1 className="text-lg md:text-xl font-bold mb-1 dark:text-white">
                Results for "<span className="text-kutuku-primary">{query}</span>"
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {products.length} {products.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
            
            {isMobile ? (
              <div className="flex items-center space-x-2 self-end md:self-auto">
                <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)} className="rounded-full border-kutuku-primary text-kutuku-primary dark:border-orange-500 dark:text-orange-400">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMobileSortOpen(true)} className="rounded-full border-kutuku-primary text-kutuku-primary dark:border-orange-500 dark:text-orange-400">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-4">
          {!isMobile && (
            <div className="w-full lg:w-64 shrink-0 space-y-4">
              {searchHistory && searchHistory.length > 0 && (
                <div className={cn(
                  "rounded-lg shadow-sm p-4 sticky top-4",
                  isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" : "bg-white"
                )}>
                  <h2 className="font-semibold text-lg mb-3 flex items-center dark:text-white">
                    <History className="h-4 w-4 mr-2 text-kutuku-primary" />
                    Recent Searches
                  </h2>
                  <SearchHistory 
                    history={searchHistory}
                    onSelectHistoryItem={(query) => handleSelectSuggestion(query)}
                    onClearHistoryItem={clearSearchHistoryItem}
                    onClearAllHistory={clearAllSearchHistory}
                  />
                </div>
              )}
              
              <div className={cn(
                "rounded-lg shadow-sm p-4 sticky top-4",
                isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" : "bg-white"
              )}>
                <h2 className="font-semibold text-lg mb-3 flex items-center dark:text-white">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-kutuku-primary" />
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
          
          <div className="flex-1">
            {initialLoad || !query ? (
              <div className="space-y-4">
                {isMobile && searchHistory && searchHistory.length > 0 && (
                  <div className={cn(
                    "rounded-lg shadow-sm p-3 md:p-4",
                    isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" : "bg-white"
                  )}>
                    <h2 className="font-semibold text-lg mb-2 flex items-center dark:text-white">
                      <History className="h-4 w-4 mr-2 text-kutuku-primary" />
                      Recent Searches
                    </h2>
                    <SearchHistory 
                      history={searchHistory}
                      onSelectHistoryItem={(query) => handleSelectSuggestion(query)}
                      onClearHistoryItem={clearSearchHistoryItem}
                      onClearAllHistory={clearAllSearchHistory}
                    />
                  </div>
                )}
                
                <div className={cn(
                  "rounded-lg shadow-sm p-3 md:p-4",
                  isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border border-gray-700" : "bg-white"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-lg flex items-center dark:text-white">
                      <Store className="h-4 w-4 mr-2 text-kutuku-primary" />
                      Browse Categories
                    </h2>
                    <Button variant="link" className="text-kutuku-primary p-0 h-auto text-sm" asChild>
                      <Link to="/categories">
                        View All <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {categories.slice(0, 10).map((category) => (
                      <div 
                        key={category.id}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                          isDarkMode 
                            ? "border-gray-700 hover:border-orange-500 dark:hover:border-orange-500" 
                            : "border-gray-100 hover:border-kutuku-primary"
                        )}
                        onClick={() => {
                          handleCategoryChange(category.id);
                          navigate(`/search?category=${category.id}`);
                        }}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          isDarkMode ? "bg-orange-900/30" : "bg-orange-100"
                        )}>
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="w-6 h-6" />
                          ) : (
                            <Store className="w-5 h-5 text-kutuku-primary" />
                          )}
                        </div>
                        <span className="text-sm text-center line-clamp-1 dark:text-gray-200">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Tabs defaultValue="recommended" className="w-full">
                  <TabsList className={cn(
                    "w-full mb-0 grid grid-cols-2",
                    isDarkMode 
                      ? "bg-gray-800 border-b border-gray-700 rounded-t-lg" 
                      : "bg-white border-b dark:border-gray-700 rounded-t-lg"
                  )}>
                    <TabsTrigger 
                      value="recommended" 
                      className="flex-1 data-[state=active]:text-kutuku-primary data-[state=active]:border-b-2 data-[state=active]:border-kutuku-primary py-3"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommends
                    </TabsTrigger>
                    <TabsTrigger 
                      value="recently-viewed" 
                      className="flex-1 data-[state=active]:text-kutuku-primary data-[state=active]:border-b-2 data-[state=active]:border-kutuku-primary py-3"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Recently Viewed
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent 
                    value="recommended" 
                    className={cn(
                      "rounded-b-lg shadow-sm p-3 md:p-4 mt-0",
                      isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border-x border-b border-gray-700" : "bg-white"
                    )}
                  >
                    <SearchRecommendations 
                      products={recommendations}
                      isAddingToCart={isAddingToCart}
                      isAddingToWishlist={isAddingToWishlist}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onShare={handleShareProduct}
                      onSelectProduct={(id) => navigate(`/product/${id}`)}
                    />
                  </TabsContent>
                  
                  <TabsContent 
                    value="recently-viewed" 
                    className={cn(
                      "rounded-b-lg shadow-sm p-3 md:p-4 mt-0",
                      isDarkMode ? "bg-gray-800/90 backdrop-blur-sm border-x border-b border-gray-700" : "bg-white"
                    )}
                  >
                    <SearchRecommendations
                      products={recentlyViewed}
                      isAddingToCart={isAddingToCart}
                      isAddingToWishlist={isAddingToWishlist}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onShare={handleShareProduct}
                      onSelectProduct={(id) => navigate(`/product/${id}`)}
                      emptyStateIcon={<Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />}
                      emptyStateTitle="No recently viewed products"
                      emptyStateMessage="Products you view will appear here"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
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
            )}
          </div>
        </div>

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
    </div>
  );
};

export default Search;
