import { useState, useCallback } from 'react';

// Add the missing useSearchViewMode hook
export const useSearchViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return { viewMode, setViewMode };
};

export const useSearchFilters = (initialCategory: string | null = null) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  
  // Availability Filters
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    onSale: false,
  });

  const handleAvailabilityFilterChange = (filterName: string, checked: boolean) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [filterName]: checked,
    }));
  };
  
  // Brand Filters
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const toggleBrandFilter = (brand: string) => {
    if (brandFilters.includes(brand)) {
      setBrandFilters(prev => prev.filter(b => b !== brand));
    } else {
      setBrandFilters(prev => [...prev, brand]);
    }
  };
  
  // Discount Filters
  const [discountFilters, setDiscountFilters] = useState<number[]>([]);

  const toggleDiscountFilter = (discount: number) => {
    if (discountFilters.includes(discount)) {
      setDiscountFilters(prev => prev.filter(d => d !== discount));
    } else {
      setDiscountFilters(prev => [...prev, discount]);
    }
  };

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleShopChange = useCallback((shop: string | null) => {
    setSelectedShop(shop);
  }, []);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setPriceRange(range);
  }, []);

  const handleRatingChange = useCallback((rating: number | null) => {
    setRating(rating);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortOption(sort);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(null);
    setAvailabilityFilters({ inStock: false, onSale: false });
    setBrandFilters([]);
    setDiscountFilters([]);
  }, []);

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
};
