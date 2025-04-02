
import { useState } from 'react';
import { SortOption } from '@/lib/types/search';

export const useSearchFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [discountFilters, setDiscountFilters] = useState<string[]>([]);
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    fastDelivery: false,
    dealOfDay: false
  });
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  
  // Additional state for search form
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [ratings, setRatings] = useState<number | null>(null);
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCategory(category); // Also update the search form state
  };

  const handleShopChange = (shop: string | null) => {
    setSelectedShop(shop);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleRatingChange = (value: number | null) => {
    setRating(value);
    setRatings(value); // Also update the search form state
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };
  
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const toggleBrandFilter = (brand: string) => {
    setBrandFilters(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };
  
  const toggleDiscountFilter = (discount: string) => {
    setDiscountFilters(prev => 
      prev.includes(discount) 
        ? prev.filter(d => d !== discount) 
        : [...prev, discount]
    );
  };
  
  const handleAvailabilityFilterChange = (key: keyof typeof availabilityFilters) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(null);
    setRatings(null);
    setBrandFilters([]);
    setDiscountFilters([]);
    setAvailabilityFilters({
      inStock: false,
      fastDelivery: false,
      dealOfDay: false
    });
    setQuery('');
  };
  
  const resetFilters = clearFilters; // Alias for backward compatibility
  
  const filterProducts = (products: any[]) => {
    return products.filter(product => {
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
      if (availabilityFilters.inStock && (!product.stock || product.stock <= 0)) {
        return false;
      }
      if (brandFilters.length > 0 && !brandFilters.includes(product.shop_id)) {
        return false;
      }
      if (discountFilters.length > 0) {
        if (!product.sale_price) return false;
        
        const discountPercent = Math.round((1 - product.sale_price / product.price) * 100);
        
        if (discountFilters.includes('10+') && discountPercent < 10) return false;
        if (discountFilters.includes('25+') && discountPercent < 25) return false;
        if (discountFilters.includes('50+') && discountPercent < 50) return false;
        if (discountFilters.includes('70+') && discountPercent < 70) return false;
      }
      
      return true;
    });
  };
  
  const sortProducts = (products: any[]) => {
    return [...products].sort((a, b) => {
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
  };

  return {
    // Original properties
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
    sortProducts,
    
    // Added properties for search form compatibility
    query,
    setQuery,
    category,
    setCategory,
    ratings,
    setRatings,
    resetFilters
  };
};
