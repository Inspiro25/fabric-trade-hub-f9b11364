
import { Product } from '@/types/product';

export interface SearchPageProduct extends Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  category?: string;
  category_id?: string;
  shop_id?: string;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  is_new?: boolean;
  is_trending?: boolean;
  description?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  tags?: string[];
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

export interface SearchResults {
  products: SearchPageProduct[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface SearchFilterState {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: string;
  page: number;
}
