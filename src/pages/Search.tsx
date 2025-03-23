
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import SearchResults from '@/components/search/SearchResults';
import SearchCategories from '@/components/search/SearchCategories';
import SearchFilters from '@/components/search/SearchFilters';
import SearchHistory from '@/components/search/SearchHistory';
import SearchRecommendations from '@/components/search/SearchRecommendations';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/components/ui/use-toast';
import AuthDialog from '@/components/search/AuthDialog';
import ShareDialog from '@/components/search/ShareDialog';
import { useSearchData } from '@/hooks/use-search-data';
import { useSearchRecommendations } from '@/hooks/use-search-recommendations';
import { useSearchUrlParams } from '@/hooks/search/use-search-params';
import { useSearchFilters } from '@/hooks/search/use-search-filters';
import { useSearchCartIntegration } from '@/hooks/search/use-search-cart-integration';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { useSearchHistory } from '@/hooks/search/use-search-history';
import { SearchPageProduct } from '@/components/search/SearchProductCard';
import { useIsMobile } from '@/hooks/use-mobile';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  
  // Get query params - Fix: use the hook as an object instead of array destructuring
  const searchParamsData = useSearchUrlParams();
  const queryParam = searchParamsData.query || '';
  
  // State for search input
  const [searchInput, setSearchInput] = useState(queryParam);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Use the search data hook
  const { 
    products, 
    categories,
    shops,
    loading, 
    error, 
    initialLoad,
    fetchData,
    totalProducts,
    currentPage,
    setCurrentPage,
    resultsPerPage,
    setResultsPerPage
  } = useSearchData(queryParam);

  // Get recommendations from the database
  const {
    recommendations,
    recentlyViewed,
    isLoading: loadingRecommendations
  } = useSearchRecommendations();
  
  // Search filter hook
  const {
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
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    handleViewModeChange,
    clearFilters
  } = useSearchFilters();
  
  // Get integrations for cart and wishlist
  const { 
    isAddingToCart, 
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist, 
    handleShareProduct
  } = useSearchCartIntegration();
  
  // Search dialogs
  const {
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    handleLogin
  } = useSearchDialogs();
  
  // Search history
  const {
    searchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory
  } = useSearchHistory();
  
  // Filter and sort products
  const filteredAndSortedProducts = (() => {
    // First filter products based on criteria
    const filtered = products.filter(product => {
      if (selectedCategory && product.category_id !== selectedCategory) {
        return false;
      }
      if (selectedShop && product.shop_id !== selectedShop) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      if (rating && (!product.rating || product.rating < rating)) {
        return false;
      }
      return true;
    });
    
    // Then sort the filtered products
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return 0; // Would normally sort by created_at
        case 'price-asc':
          return (a.sale_price || a.price) - (b.sale_price || b.price);
        case 'price-desc':
          return (b.sale_price || b.price) - (a.sale_price || a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'relevance':
        default:
          return 0;
      }
    });
  })();
  
  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchInput.trim()) {
      // Use the navigate function from the useSearchUrlParams hook
      const queryString = searchParamsData.createQueryString('q', searchInput.trim());
      navigate(`/search?${queryString}`);
      setHasSearched(true);
      saveSearchHistory(searchInput.trim());
    }
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput('');
    navigate('/search');
    setHasSearched(false);
  };
  
  // Handle product click
  const handleProductClick = (product: SearchPageProduct) => {
    navigate(`/product/${product.id}`);
  };
  
  // Effect to handle URL search param changes
  useEffect(() => {
    if (queryParam) {
      setSearchInput(queryParam);
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  }, [queryParam]);
  
  return (
    <div className={cn(
      "container mx-auto px-4 py-6 space-y-6",
      isDarkMode ? "bg-gray-900 text-white" : ""
    )}>
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Search Products</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={cn(
                "pl-10",
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
              )}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button type="submit" variant="default">
            Search
          </Button>
          {hasSearched && (
            <Button type="button" variant="outline" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - Categories & Filters (Hidden on Mobile) */}
        {!isMobile && (
          <div className="space-y-6">
            <SearchCategories 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
            
            <SearchFilters
              isMobile={false}
              categories={categories}
              priceRange={priceRange}
              handlePriceRangeChange={handlePriceRangeChange}
              rating={rating}
              handleRatingChange={handleRatingChange}
              selectedShop={selectedShop}
              shops={shops}
              handleShopChange={handleShopChange}
              clearFilters={clearFilters}
              selectedCategory={selectedCategory}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
        )}
        
        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Search Results Section */}
          {hasSearched ? (
            <SearchResults
              products={filteredAndSortedProducts}
              loading={loading}
              error={error}
              totalProducts={totalProducts}
              isAddingToCart={isAddingToCart}
              isAddingToWishlist={isAddingToWishlist}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onShareProduct={handleShareProduct}
              onProductClick={handleProductClick}
              onRetry={fetchData}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={resultsPerPage}
              onItemsPerPageChange={setResultsPerPage}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
          ) : (
            <div className="space-y-6">
              {/* Search history (when not searched) */}
              {searchHistory.length > 0 && (
                <SearchHistory 
                  history={searchHistory}
                  onSelectHistoryItem={(query) => {
                    setSearchInput(query);
                    const queryString = searchParamsData.createQueryString('q', query);
                    navigate(`/search?${queryString}`);
                  }}
                  onClearHistoryItem={clearSearchHistoryItem}
                  onClearAllHistory={clearAllSearchHistory}
                />
              )}
              
              {/* Recommendations (when not searched) */}
              <SearchRecommendations
                products={recommendations}
                isAddingToCart={isAddingToCart}
                isAddingToWishlist={isAddingToWishlist}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShareProduct={handleShareProduct}
                onSelectProduct={(id) => navigate(`/product/${id}`)}
              />
              
              {/* Recently viewed (when not searched) */}
              {recentlyViewed.length > 0 && (
                <SearchRecommendations
                  products={recentlyViewed}
                  isAddingToCart={isAddingToCart}
                  isAddingToWishlist={isAddingToWishlist}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onShareProduct={handleShareProduct}
                  onSelectProduct={(id) => navigate(`/product/${id}`)}
                  emptyStateIcon={<span className="text-3xl">👁️</span>}
                  emptyStateTitle="No recently viewed products"
                  emptyStateMessage="Browse products to see your history here"
                />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Auth Dialog */}
      <AuthDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onLogin={handleLogin} 
      />
      
      {/* Share Dialog */}
      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        link={shareableLink}
      />
    </div>
  );
};

export default Search;
