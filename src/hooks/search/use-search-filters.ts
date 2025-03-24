
import { useState } from 'react';

export function useSearchFilters() {
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const clearFilters = () => {
    setFilters([]);
    setSelectedCategory('');
    setSelectedShop('');
    setPriceRange([0, 1000]);
    setRating(0);
    setActiveFilters([]);
  };

  const addFilter = (filter: string) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter(f => f !== filter));
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
    clearFilters,
    selectedCategory,
    setSelectedCategory,
    selectedShop,
    setSelectedShop,
    priceRange,
    setPriceRange,
    rating,
    setRating,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    activeFilters,
    toggleFilter
  };
}

export function useSearchViewMode() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  return { viewMode, setViewMode };
}

export function useSearchPagination(initialPage = 1, initialItemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage
  };
}
