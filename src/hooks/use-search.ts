
import { useState, useCallback } from 'react';
import { useSearchData } from './use-search-data';
import { useSearchFilters } from './use-search-filters';
import { useSearchHistory } from './use-search-history';
import { useRecommendations } from './use-recommendations';
import { SearchPageProduct } from '@/components/search/SearchProductCard';
import { Product } from '@/lib/types/product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'relevance';

export const useSearch = (query: string) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  // State for UI interactions
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchPageProduct | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  // Hook composition for modular functionality
  const { 
    products: rawProducts, 
    categories, 
    shops, 
    loading, 
    error,
    initialLoad,
    fetchData
  } = useSearchData(query);
  
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
    filterProducts,
    sortProducts
  } = useSearchFilters();
  
  const {
    searchHistory,
    popularSearches,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory
  } = useSearchHistory(currentUser?.uid || null);
  
  const {
    recommendations,
    recentlyViewed
  } = useRecommendations(currentUser?.uid || null);

  // Apply filters and sorting
  const filteredProducts = filterProducts(rawProducts);
  const products = sortProducts(filteredProducts);

  const convertToImportedProduct = (product: SearchPageProduct): Product => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price || undefined,
      images: product.images,
      category: product.category_id || "uncategorized",
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.is_new,
      isTrending: product.is_trending,
      rating: product.rating,
      reviewCount: product.review_count,
      stock: product.stock || 10,
      tags: [],
      shopId: product.shop_id
    };
  };

  const handleProductClick = useCallback((product: SearchPageProduct) => {
    navigate(`/product/${product.id}`);
  }, [navigate]);

  const handleAddToCart = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToCart(product.id);
    try {
      const convertedProduct = convertToImportedProduct(product);
      await addToCart(convertedProduct, 1, convertedProduct.colors[0] || null, convertedProduct.sizes[0] || null);
      toast({
        title: "Success",
        description: `${product.name} added to cart.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart.",
      });
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleAddToWishlist = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToWishlist(product.id);
    try {
      const convertedProduct = convertToImportedProduct(product);
      await addToWishlist(convertedProduct);
      toast({
        title: "Success",
        description: `${product.name} added to wishlist.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to wishlist.",
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    const productLink = `${window.location.origin}/product/${product.id}`;
    setShareableLink(productLink);
    setIsShareDialogOpen(true);
  };

  const handleLogin = () => {
    setIsDialogOpen(false);
    navigate('/auth');
  };

  return {
    // Data
    products,
    categories,
    shops,
    loading,
    error,
    searchHistory,
    recommendations,
    initialLoad,
    recentlyViewed,
    popularSearches,
    
    // Filters and sorting
    selectedCategory,
    selectedShop,
    priceRange,
    rating,
    sortOption,
    viewMode,
    brandFilters,
    discountFilters,
    availabilityFilters,
    
    // UI state
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    isAddingToCart,
    isAddingToWishlist,
    isDialogOpen,
    setIsDialogOpen,
    selectedProduct,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    
    // Actions
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
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
    handleLogin,
    fetchData,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    handleProductClick
  };
};
