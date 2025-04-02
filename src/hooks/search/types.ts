
// Define search-related types
import { Json } from '@/lib/types/json';

export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  shop_id?: string;
  is_new?: boolean;
  is_trending?: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
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

// Add other search-related types as needed
