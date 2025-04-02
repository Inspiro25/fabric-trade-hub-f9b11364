
import { Product } from '@/types/product';

export type { SearchPageProduct } from '@/types/product';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  rating?: number;
  followers?: number;
  isVerified?: boolean;
  productCount?: number;
}

export interface ProductCardBaseProps {
  product: Product;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  onClick?: (product: Product) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}

export interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  rating: number | null;
  sortBy: string;
  inStock: boolean;
  newArrivals: boolean;
  onSale: boolean;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Product[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  page: number;
  pageSize: number;
  viewMode: 'grid' | 'list';
}
