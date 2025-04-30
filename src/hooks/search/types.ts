
import { Product } from '@/lib/products/types';

// Extend the Product interface for search-related functionality
export interface SearchPageProduct extends Omit<Product, 'description' | 'colors' | 'sizes' | 'tags' | 'stock'> {
  description?: string;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  stock?: number;
  shopId?: string;
  shop_id?: string;
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Shop {
  id: string;
  name: string;
  logo?: string;
  description?: string;
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
