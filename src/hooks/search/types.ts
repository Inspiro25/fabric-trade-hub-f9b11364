
import { Product } from '@/lib/products/types';

export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null;
  images: string[];
  category?: string;
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  available_colors?: string[];
  available_sizes?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  shop_id?: string | null;
  shopId?: string | null;
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  tags?: string[];
  brand?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;  // Required to match Search.tsx
  description: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  cover_image: string;
  address: string;
  rating: number;
  reviewCount: number;
  review_count: number;
  isVerified: boolean;
  is_verified: boolean;
  ownerName: string;
  owner_name: string;
  ownerEmail: string; // Required
  owner_email: string; // Required
  status: 'pending' | 'active' | 'suspended'; // Make required
  shopId: string;
  shop_id: string; // Required
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
  isCompact?: boolean; // Property for compact mode
}
