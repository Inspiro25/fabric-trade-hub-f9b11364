
export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  is_new?: boolean;
  is_trending?: boolean;
  rating?: number;
  review_count?: number;
  stock?: number;
  tags?: string[];
  shop_id?: string;
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
  isAddingToCart?: string;
  isAddingToWishlist?: string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
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
