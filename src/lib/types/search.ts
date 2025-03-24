
export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number;
  images: string[];
  category_id?: string;
  category?: string;
  colors?: string[];
  sizes?: string[];
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
  shop_id?: string;
  shop?: {
    id: string;
    name: string;
    logo?: string;
  } | null;
  // Additional frontend properties
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  rating?: number;
  review_count?: number;
  followers_count?: number;
}

// Base ProductCard props that all variants share
export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: boolean;
  isAddingToWishlist?: boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
  highlight?: string;
}

export interface SearchFiltersProps {
  categories?: Category[];
  priceRanges?: { id: string; name: string; min: number; max: number }[];
  ratings?: { id: string; name: string; value: number }[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export interface SearchResultsProps {
  products: SearchPageProduct[];
  isLoading?: boolean;
  error?: string;
  totalProducts: number;
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShareProduct?: (product: SearchPageProduct) => void;
  onProductClick?: (product: SearchPageProduct) => void;
  onSelectProduct?: (id: string) => void;
  onRetry?: () => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export interface SearchRecommendationsProps {
  recommendedProducts: SearchPageProduct[];
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShareProduct?: (product: SearchPageProduct) => void;
  onSelectProduct?: (id: string) => void;
  title?: string;
  emptyStateMessage?: string;
}
