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
  
  const urlQuery = searchParams.get('q') || '';
  
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
  
  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState('');
  const [setPriceRange] = useState<(range: number[]) => void>(() => () => {});
  const [ratings, setRatings] = useState(0);
  const [setSortOption] = useState<(option: SortOption) => void>(() => () => {});
  const [setViewMode] = useState<(mode: 'list' | 'grid') => void>(() => () => {});
  
  useEffect(() => {
    if (urlQuery && !query) {
      setQuery(urlQuery);
    }
  }, [urlQuery, query]);
  
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const totalProducts = products.length;
  const pageCount = Math.ceil(totalProducts / resultsPerPage);
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  
  const searchHistoryUtils = useSearchHistory(userId);
  const { 
    searchHistory,
    popularSearches,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    fetchSearchHistory
  } = searchHistoryUtils;
  
  const { recommendations } = useRecommendations(userId);
  
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
      fetchData();
      
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
  
  useEffect(() => {
    executeSearch();
  }, [executeSearch]);
  
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    
    if (queryParam || categoryParam) {
      setHasSearched(true);
    }
  }, [searchParams]);
  
  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    addToCart({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      salePrice: product.salePrice,
      images: product.images || [],
      category: product.category || "",
      colors: product.colors || [],
      sizes: product.sizes || [],
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock || 0,
      tags: product.tags || []
    }, 1, "", "");
    setTimeout(() => setIsAddingToCart(null), 1000);
  }, [addToCart]);
  
  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    // Wishlist implementation would go here
    setTimeout(() => setIsAddingToWishlist(null), 1000);
  }, []);
  
  const handleShareProduct = useCallback((product: SearchPageProduct) => {
    const shareLink = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareLink);
    setIsShareDialogOpen(true);
  }, []);
  
  const handleLogin = useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  
  return {
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
    
    products,
    isLoading: loading,
    error,
    totalProducts,
    pageCount,
    
    currentPage,
    setCurrentPage,
    resultsPerPage,
    setResultsPerPage,
    
    hasSearched,
    executeSearch,
    resetFilters,
    
    handleAddToCart,
    
    searchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    
    recommendations,
    
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
    
    categories,
    shops
  };
};
