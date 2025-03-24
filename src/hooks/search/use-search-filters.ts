
import { useState, useCallback, useEffect } from 'react';

export const useSearchFilters = (initialCategory: string | null = null) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    outOfStock: false
  });
  const [brandFilters, setBrandFilters] = useState<Record<string, boolean>>({});
  const [discountFilters, setDiscountFilters] = useState({
    discounted: false,
    nonDiscounted: false
  });

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleShopChange = useCallback((shop: string | null) => {
    setSelectedShop(shop);
  }, []);

  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setPriceRange(range);
  }, []);

  const handleRatingChange = useCallback((newRating: number | null) => {
    setRating(newRating);
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleAvailabilityFilterChange = useCallback((key: keyof typeof availabilityFilters, value: boolean) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const toggleBrandFilter = useCallback((brand: string) => {
    setBrandFilters(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  }, []);

  const toggleDiscountFilter = useCallback((key: keyof typeof discountFilters) => {
    setDiscountFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 10000]);
    setRating(null);
    setSortOption('relevance');
    setAvailabilityFilters({
      inStock: false,
      outOfStock: false
    });
    setBrandFilters({});
    setDiscountFilters({
      discounted: false,
      nonDiscounted: false
    });
  }, []);

  // Reset other filters when category changes
  useEffect(() => {
    if (initialCategory !== selectedCategory && initialCategory !== null) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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

// Export a separate hook just for view mode
export const useSearchViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  return {
    viewMode,
    setViewMode,
    handleViewModeChange
  };
};
