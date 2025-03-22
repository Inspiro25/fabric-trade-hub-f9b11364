
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SearchPageProduct } from '@/components/search/product-card/types';
import { useSearchFilters } from './use-search-filters';
import { useSearchData } from './use-search-data';

export type SortOption = 'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';

export const useSearch = (initialQuery: string) => {
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  
  const { 
    products: fetchedProducts, 
    categories, 
    shops, 
    loading, 
    error, 
    fetchData 
  } = useSearchData(query);

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
    clearFilters,
    filterProducts,
    sortProducts
  } = useSearchFilters();

  const timeoutRef = useRef<number | null>(null);

  // Parse URL params for category filter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      handleCategoryChange(categoryParam);
    }
  }, []);

  // Filter and sort products
  const filteredProducts = filterProducts(fetchedProducts);
  const products = sortProducts(filteredProducts);
  
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setShowSuggestions(false);
    
    // Update URL with search query
    const url = new URL(window.location.href);
    if (newQuery) {
      url.searchParams.set('q', newQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSearch(inputValue);
  };

  const handleAutocomplete = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };
  
  const handleClear = () => {
    setInputValue('');
    setQuery('');
    setShowSuggestions(false);
    
    // Update URL to remove search query
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
  };

  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    
    setTimeout(() => {
      setIsAddingToCart(null);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    setTimeout(() => {
      setIsAddingToWishlist(null);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }, 500);
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    setShareableLink(shareUrl);
    setIsShareDialogOpen(true);
  };

  const saveSearchHistory = async (query: string, userId: string) => {
    try {
      await supabase.from('search_history').insert({
        user_id: userId,
        query: query.toLowerCase().trim(),
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Fetch search history and popular searches
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.session?.user) {
          const { data: history } = await supabase
            .from('search_history')
            .select('*')
            .eq('user_id', session.session.user.id)
            .order('searched_at', { ascending: false })
            .limit(10);
          
          setSearchHistory(history || []);
        }
        
        const { data: popular } = await supabase
          .from('popular_search_terms')
          .select('*')
          .order('count', { ascending: false })
          .limit(10);
        
        setPopularSearches(popular || []);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };
    
    fetchSearchData();
  }, []);

  return {
    query,
    inputValue,
    showSuggestions,
    categories,
    shops,
    products,
    loading,
    error,
    isAddingToCart,
    isAddingToWishlist,
    shareableLink,
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    viewMode,
    searchHistory,
    popularSearches,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    handleInputChange,
    handleSearchSubmit,
    handleAutocomplete,
    handleClear,
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
    fetchData,
    saveSearchHistory,
  };
};
