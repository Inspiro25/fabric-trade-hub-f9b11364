import { useEffect } from 'react';
import { useSearchUrlParams } from './search/use-search-params';
import { useSearchFilters } from './search/use-search-filters';
import { useSearchHistory } from './search/use-search-history';
import { useSearchCartIntegration } from './search/use-search-cart-integration';
import { useSearchMockData } from './search/use-search-mock-data';
import { useSearchDialogs } from './search/use-search-dialogs';
import { SearchPageProduct, Category, Shop, ProductCardBaseProps } from './search/types';

// Re-export types from the types file
export type { SearchPageProduct, Category, Shop, ProductCardBaseProps };

const useSearch = () => {
  // Combine all the smaller hooks
  const { 
    query, 
    category, 
    page, 
    itemsPerPage, 
    sort, 
    viewModeParam, 
    createQueryString,
    navigate 
  } = useSearchUrlParams();

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
    availabilityFilters,
    handleAvailabilityFilterChange,
    brandFilters,
    toggleBrandFilter,
    discountFilters,
    toggleDiscountFilter,
    handleCategoryChange,
    handleShopChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    handleViewModeChange,
    clearFilters,
    setViewMode
  } = useSearchFilters(category || null);

  const {
    searchHistory,
    popularSearches,
    saveSearchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory
  } = useSearchHistory();

  const {
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct
  } = useSearchCartIntegration();

  const {
    loading,
    error,
    products,
    totalProducts,
    categories,
    shops,
    initialLoad,
    recommendations,
    recentlyViewed,
    fetchData,
    handleRetry
  } = useSearchMockData(query, category, page, itemsPerPage);

  const {
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    setShareableLink,
    handleLogin
  } = useSearchDialogs();

  // Set up effects that were in the original hook
  useEffect(() => {
    fetchData();
  }, [query, category, page, itemsPerPage, sort]);

  useEffect(() => {
    if (category) {
      handleCategoryChange(category);
    }
    
    if (viewModeParam === 'list' || viewModeParam === 'grid') {
      setViewMode(viewModeParam);
    }
  }, [category, viewModeParam]);

  // Create a wrapper for handleShareProduct
  const onShareProduct = (product: SearchPageProduct) => {
    const link = handleShareProduct(product);
    setShareableLink(link);
    setIsShareDialogOpen(true);
  };

  // Return combined state and handlers from all hooks
  return {
    loading,
    error,
    products,
    totalProducts,
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct: onShareProduct,
    handleRetry,
    query,
    category,
    page,
    itemsPerPage,
    sort,
    viewMode,
    createQueryString,
    categories,
    shops,
    isLoading: loading,
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
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
    saveSearchHistory
  };
};

export default useSearch;
