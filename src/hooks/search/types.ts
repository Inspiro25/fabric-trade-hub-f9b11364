
import { Shop } from '@/lib/shops/types';

export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  description: string;
  category_id: string;
  colors: string[];
  sizes: string[];
  rating: number;
  review_count: number;
  stock: number;
  shop_id: string;
  is_new: boolean;
  is_trending: boolean;
  tags: string[];
}

export interface UseSearchResult {
  searchResults: SearchPageProduct[];
  isLoading: boolean;
  error: Error | null;
  totalResults: number;
}

export interface SearchFilterOption {
  id: string;
  name: string;
  count?: number;
}

export interface SearchFilterGroup {
  id: string;
  name: string;
  options: SearchFilterOption[];
}
