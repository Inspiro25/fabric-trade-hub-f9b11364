
export interface ProductCardBaseProps {
  product: SearchPageProduct | Product;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: SearchPageProduct | Product) => void;
  onAddToWishlist?: (product: SearchPageProduct | Product) => void;
  onShare?: (product: SearchPageProduct | Product) => void;
  onClick?: (product: SearchPageProduct | Product) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
}

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
  shop_id?: string | null;
  shopId?: string | null;
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  colors?: string[];
  sizes?: string[];
  available_colors?: string[];
  available_sizes?: string[];
  rating?: number;
  review_count?: number;
  reviewCount?: number;
  stock?: number;
  brand?: string;
  tags?: string[];
}

// This is needed for compatibility with the Product type from lib/products
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  images: string[];
  category?: string;
  category_id?: string;
  isNew?: boolean;
  is_new?: boolean;
  isTrending?: boolean;
  is_trending?: boolean;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  brand?: string;
  description?: string;
  stock?: number;
  tags?: string[];
  shop_id?: string | null;
}
