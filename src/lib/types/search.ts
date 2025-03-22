import { SearchPageProduct } from '@/hooks/search/types';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'relevance';

export interface ProductFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
  shop?: string;
}

export interface SearchFilterReturn {
  query: string;
  setQuery: (query: string) => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  ratings: number | null;
  setRatings: (rating: number | null) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
  // Filter options from useSearchFilters
  selectedCategory: string | null;
  selectedShop: string | null;
  rating: number | null;
  brandFilters: string[];
  discountFilters: string[];
  availabilityFilters: {
    inStock: boolean;
    fastDelivery: boolean;
    dealOfDay: boolean;
  };
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  mobileSortOpen: boolean;
  setMobileSortOpen: (open: boolean) => void;
  handleCategoryChange: (category: string | null) => void;
  handleShopChange: (shop: string | null) => void;
  handlePriceRangeChange: (value: number[]) => void;
  handleRatingChange: (value: number | null) => void;
  handleSortChange: (value: string) => void;
  handleViewModeChange: (mode: 'grid' | 'list') => void;
  toggleBrandFilter: (brand: string) => void;
  toggleDiscountFilter: (discount: string) => void;
  handleAvailabilityFilterChange: (key: string) => void;
  clearFilters: () => void;
  filterProducts: (products: any[]) => any[];
  sortProducts: (products: any[]) => any[];
}

export interface SearchDataReturn {
  products: SearchPageProduct[];
  categories: any[];
  shops: any[];
  loading: boolean;
  error: string | null;
  initialLoad: boolean;
  fetchData: () => Promise<void>;
  totalProducts: number;
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resultsPerPage: number;
  setResultsPerPage: (items: number) => void;
}

export interface SearchReturn {
  // Search state
  query: string;
  setQuery: (query: string) => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  ratings: number | null;
  setRatings: (rating: number | null) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Results state
  products: SearchPageProduct[];
  isLoading: boolean;
  error: string | null;
  totalProducts: number;
  pageCount: number;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  resultsPerPage: number;
  setResultsPerPage: (items: number) => void;
  
  // Search status
  hasSearched: boolean;
  executeSearch: () => Promise<any>;
  resetFilters: () => void;
  
  // Cart integration
  handleAddToCart: (product: SearchPageProduct) => void;
  
  // Search history
  searchHistory: any[];
  clearSearchHistoryItem: (id: string) => void;
  clearAllSearchHistory: () => void;
  saveSearchHistory: (query: string) => void;
  
  // Recommendations
  recommendations: SearchPageProduct[];
  
  // From useSearchFilters
  selectedCategory: string | null;
  selectedShop: string | null;
  rating: number | null;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  mobileSortOpen: boolean;
  setMobileSortOpen: (open: boolean) => void;
  handleCategoryChange: (category: string | null) => void;
  handleShopChange: (shop: string | null) => void;
  handlePriceRangeChange: (value: number[]) => void;
  handleRatingChange: (value: number | null) => void;
  handleSortChange: (value: string) => void;
  handleViewModeChange: (mode: 'grid' | 'list') => void;
  clearFilters: () => void;
  
  // Additional features
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  handleAddToWishlist: (product: SearchPageProduct) => void;
  handleShareProduct: (product: SearchPageProduct) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: (open: boolean) => void;
  shareableLink: string;
  initialLoad: boolean;
  recentlyViewed: SearchPageProduct[];
  popularSearches: string[];
  availabilityFilters: {
    inStock: boolean;
    fastDelivery: boolean;
    dealOfDay: boolean;
  };
  handleAvailabilityFilterChange: (key: string) => void;
  brandFilters: string[];
  toggleBrandFilter: (brand: string) => void;
  discountFilters: string[];
  toggleDiscountFilter: (discount: string) => void;
  fetchData: () => Promise<void>;
  handleLogin: () => void;
  
  // Additional data-related properties needed by the search page
  categories: any[];
  shops: any[];
}
