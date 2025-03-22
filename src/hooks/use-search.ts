
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSearchFilters } from './use-search-filters';
import { useSearchData } from './use-search-data';
import { getProducts } from '@/lib/products/index';
import { ProductFilters } from '@/lib/products/filters';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchHistory } from './use-search-history';
import { useRecommendations } from './use-recommendations';

export const useSearch = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || null;
  
  // Initialize search filters from URL params
  const {
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
    resetFilters
  } = useSearchFilters(searchParams, setSearchParams);
  
  // Search data state
  const {
    products,
    isLoading,
    error,
    totalProducts,
    pageCount,
    currentPage,
    setCurrentPage,
    resultsPerPage,
    setResultsPerPage
  } = useSearchData();
  
  // Search execution state
  const [hasSearched, setHasSearched] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  
  // Search history integration
  const { 
    searchHistory,
    addToSearchHistory,
    clearSearchHistory
  } = useSearchHistory(userId);
  
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
      // Get search results
      const searchResults = await getProducts(filters);
      
      // Add search to history if this is a new search
      if (query && !searchExecuted) {
        addToSearchHistory(query);
      }
      
      setSearchExecuted(true);
      setHasSearched(true);
      
      return searchResults;
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
    addToSearchHistory
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
  const handleAddToCart = useCallback((productId: string) => {
    addToCart(productId, 1);
  }, [addToCart]);
  
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
    isLoading,
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
    clearSearchHistory,
    
    // Recommendations
    recommendations
  };
};
