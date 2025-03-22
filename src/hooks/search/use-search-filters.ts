
import { useState } from 'react';

export const useSearchFilters = (initialCategory: string | null = null) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [availabilityFilters, setAvailabilityFilters] = useState<{inStock: boolean, outOfStock: boolean}>({
    inStock: false,
    outOfStock: false
  });
  const [brandFilters, setBrandFilters] = useState<{[key: string]: boolean}>({});
  const [discountFilters, setDiscountFilters] = useState<{[key: string]: boolean}>({});
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };
  
  const handleShopChange = (shopId: string) => {
    setSelectedShop(shopId === selectedShop ? null : shopId);
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  const handleRatingChange = (value: number) => {
    setRating(value === rating ? 0 : value);
  };
  
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };
  
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };
  
  const handleAvailabilityFilterChange = (filter: 'inStock' | 'outOfStock', value: boolean) => {
    setAvailabilityFilters(prev => ({...prev, [filter]: value}));
  };
  
  const toggleBrandFilter = (brand: string) => {
    setBrandFilters(prev => ({...prev, [brand]: !prev[brand]}));
  };
  
  const toggleDiscountFilter = (discount: string) => {
    setDiscountFilters(prev => ({...prev, [discount]: !prev[discount]}));
  };
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(0);
    setAvailabilityFilters({inStock: false, outOfStock: false});
    setBrandFilters({});
    setDiscountFilters({});
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
};
