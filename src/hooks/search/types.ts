
import { Product } from '@/lib/products/types';

// Extend the Product interface for search-related functionality
export interface SearchPageProduct extends Omit<Product, 'description' | 'colors' | 'sizes' | 'tags' | 'stock'> {
  description?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  stock?: number;
}

export interface SearchFilters {
  price?: {
    min: number;
    max: number;
  };
  categories?: string[];
  ratings?: number[];
  brands?: string[];
  colors?: string[];
  sizes?: string[];
  onSale?: boolean;
  inStock?: boolean;
  sortBy?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export interface SearchSortOption {
  label: string;
  value: string;
}

export interface SearchResult {
  products: SearchPageProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
