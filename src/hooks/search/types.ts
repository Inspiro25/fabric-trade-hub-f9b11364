
import { Product } from '@/lib/products/types';

export interface SearchPageProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null;
  images: string[];
  category?: string;
  category_id?: string;
  shop_id?: string;
  shopId?: string;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  brand?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  rating?: number;
  productCount?: number;
  isVerified?: boolean;
}

export interface ProductCardBaseProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}
