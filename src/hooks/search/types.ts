
import { Product } from '@/types/product';

export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  category_id?: string;
  shop_id?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  is_new?: boolean;
  is_trending?: boolean;
  description?: string;
  tags?: string[];
  created_at?: string;
}

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
  description?: string;
  rating?: number;
  followers?: number;
  isVerified?: boolean;
  productCount?: number;
}

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
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
  results: SearchPageProduct[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  page: number;
  pageSize: number;
  viewMode: 'grid' | 'list';
}
