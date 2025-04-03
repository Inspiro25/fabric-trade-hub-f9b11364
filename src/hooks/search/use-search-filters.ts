import { useState, useEffect } from 'react';

export const useSearchViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  
  const handleViewModeChange = (mode: 'grid' | 'list' | 'compact') => {
    setViewMode(mode);
    localStorage.setItem('search-view-mode', mode);
  };
  
  useEffect(() => {
    const savedMode = localStorage.getItem('search-view-mode') as 'grid' | 'list' | 'compact' | null;
    if (savedMode && (savedMode === 'grid' || savedMode === 'list' || savedMode === 'compact')) {
      setViewMode(savedMode);
    }
  }, []);
  
  return { viewMode, setViewMode, handleViewModeChange };
};

export function useSearchFilters(initialCategory: string | null) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState('relevance');
  const { viewMode, setViewMode, handleViewModeChange } = useSearchViewMode();
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  
  // Availability filters (in stock, out of stock)
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    outOfStock: false
  });
  
  // Brand filters
  const [brandFilters, setBrandFilters] = useState<Record<string, boolean>>({});
  
  // Discount filters
  const [discountFilters, setDiscountFilters] = useState({
    onSale: false,
    under25: false,
    under50: false,
    under100: false
  });
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  const handleShopChange = (shop: string | null) => {
    setSelectedShop(shop);
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const handleRatingChange = (newRating: number | null) => {
    setRating(newRating);
  };
  
  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };
  
  const handleAvailabilityFilterChange = (filter: 'inStock' | 'outOfStock', value: boolean) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };
  
  const toggleBrandFilter = (brand: string) => {
    setBrandFilters(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };
  
  const toggleDiscountFilter = (filter: keyof typeof discountFilters) => {
    setDiscountFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(null);
    setSortOption('relevance');
    setAvailabilityFilters({
      inStock: false,
      outOfStock: false
    });
    setBrandFilters({});
    setDiscountFilters({
      onSale: false,
      under25: false,
      under50: false,
      under100: false
    });
  };
  
  return {
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
  };
}
