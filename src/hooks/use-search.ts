
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSearchFilters } from './use-search-filters';
import { useSearchData } from './use-search-data';
import { fetchProducts } from '@/lib/products/base'; 
import { ProductFilters, SortOption, SearchReturn } from '@/lib/types/search';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchHistory } from './use-search-history';
import { useRecommendations } from './use-recommendations';
import { SearchPageProduct } from '@/components/search/SearchProductCard';

export const useSearch = (): SearchReturn => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;
  
  // Get query from URL
  const urlQuery = searchParams.get('q') || '';
  
  // Initialize search filters state
  const filters = useSearchFilters();
  const {
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    viewMode,
    brandFilters,
    discountFilters,
    availabilityFilters,
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
    toggleBrandFilter,
    toggleDiscountFilter,
    handleAvailabilityFilterChange,
    clearFilters,
    resetFilters
  } = filters;
  
  // Custom state needed for useSearch
  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState('');
  const [setPriceRange] = useState<(range: number[]) => void>(() => () => {});
  const [ratings, setRatings] = useState(0);
  const [setSortOption] = useState<(option: SortOption) => void>(() => () => {});
  const [setViewMode] = useState<(mode: 'list' | 'grid') => void>(() => () => {});
  
  // Initialize URL query if present
  useEffect(() => {
    if (urlQuery && !query) {
      setQuery(urlQuery);
    }
  }, [urlQuery, query]);
  
  // Search data state
  const searchData = useSearchData(query);
  const {
    products,
    categories,
    shops,
    loading,
    error,
    initialLoad,
    fetchData
  } = searchData;
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const totalProducts = products.length;
  const pageCount = Math.ceil(totalProducts / resultsPerPage);
  
  // Search execution state
  const [hasSearched, setHasSearched] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  // Cart/Wishlist state
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  
  // Search history integration
  const searchHistoryUtils = useSearchHistory(userId);
  const { 
    searchHistory,
    popularSearches,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    fetchSearchHistory
  } = searchHistoryUtils;
  
  // Product recommendations
  const { recommendations } = useRecommendations(userId);
  
  // Perform search with current filters
  const executeSearch = useCallback(async () => {
    if (!query && !category) return;
    
    const filters: ProductFilters = {
      query: query || '',
      category: category || undefined,
      minPrice: priceRange?.[0] || undefined,
      maxPrice: priceRange?.[1] || undefined,
      minRating: ratings || undefined,
      sortBy: sortOption || undefined,
      page: currentPage,
      limit: resultsPerPage
    };
    
    try {
      // Get search results - this is now just calling fetchData directly
      // since we're already fetching in useSearchData
      fetchData();
      
      // Add search to history if this is a new search
      if (query && !searchExecuted && userId) {
        saveSearchHistory(query);
      }
      
      setSearchExecuted(true);
      setHasSearched(true);
      
      return products;
    } catch (error) {
      console.error("Search execution error:", error);
      return null;
    }
  }, [
    query, 
    category, 
    priceRange, 
    ratings, 
    sortOption, 
    currentPage, 
    resultsPerPage,
    searchExecuted,
    saveSearchHistory,
    userId,
    products,
    fetchData
  ]);
  
  // Execute search when filters change
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);
  
  // Check if search was initiated from the URL on initial load
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    
    if (queryParam || categoryParam) {
      setHasSearched(true);
    }
  }, [searchParams]);
  
  // Add product to cart
  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    // Fix: Call addToCart with all required parameters (id, quantity, color, size)
    addToCart(product.id, 1, "", ""); // Adding empty strings for color and size as defaults
    setTimeout(() => setIsAddingToCart(null), 1000);
  }, [addToCart]);
  
  // Handle add to wishlist
  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    // Wishlist implementation would go here
    setTimeout(() => setIsAddingToWishlist(null), 1000);
  }, []);
  
  // Handle share product
  const handleShareProduct = useCallback((product: SearchPageProduct) => {
    const shareLink = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareLink);
    setIsShareDialogOpen(true);
  }, []);
  
  // Login handler
  const handleLogin = useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  
  return {
    // Search state
    query,
    setQuery,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    ratings,
    setRatings,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    
    // Results state
    products,
    isLoading: loading,
    error,
    totalProducts,
    pageCount,
    
    // Pagination
    currentPage,
    setCurrentPage,
    resultsPerPage,
    setResultsPerPage,
    
    // Search status
    hasSearched,
    executeSearch,
    resetFilters,
    
    // Cart integration
    handleAddToCart,
    
    // Search history
    searchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    
    // Recommendations
    recommendations,
    
    // From useSearchFilters
    selectedCategory,
    selectedShop,
    rating,
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
    clearFilters,
    
    // Additional features
    isAddingToCart,
    isAddingToWishlist,
    handleAddToWishlist,
    handleShareProduct,
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    initialLoad,
    recentlyViewed,
    popularSearches,
    availabilityFilters,
    handleAvailabilityFilterChange,
    brandFilters,
    toggleBrandFilter,
    discountFilters,
    toggleDiscountFilter,
    fetchData,
    handleLogin,
    
    // Additional data needed by the search page
    categories,
    shops
  };
};
