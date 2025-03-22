
export interface ProductCardBaseProps {
  product: SearchPageProduct | Product;
  isAddingToCart?: boolean | string;
  isAddingToWishlist?: boolean | string;
  onAddToCart?: (product: SearchPageProduct | Product) => void;
  onAddToWishlist?: (product: SearchPageProduct | Product) => void;
  onShare?: (product: SearchPageProduct | Product) => void;
  onClick?: (product: SearchPageProduct | Product) => void;
}

export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  images: string[];
  category?: string;
  category_id?: string;
  shop_id?: string;
  is_new?: boolean;
  is_trending?: boolean;
  colors?: string[];
  sizes?: string[];
  available_colors?: string[];
  available_sizes?: string[];
  rating?: number;
  review_count?: number;
  stock?: number;
  brand?: string;
}

// This is needed for compatibility with the Product type from lib/products
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  rating?: number;
  reviewCount?: number;
  brand?: string;
}
