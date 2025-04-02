
// Define the core Product type that will be used throughout the application
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  salePrice?: number | null;
  images: string[];
  category?: string;
  category_id?: string;
  colors: string[];
  sizes: string[];
  is_new?: boolean;
  isNew?: boolean;
  is_trending?: boolean;
  isTrending?: boolean;
  rating: number;
  review_count?: number;
  reviewCount?: number;
  stock: number;
  tags: string[];
  shop_id?: string;
  shopId?: string;
  brand?: string;
  created_at?: string;
  updated_at?: string;
  shopName?: string;
  categoryId?: string;
}

// Define the SearchPageProduct type with required fields
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
  brand?: string;
}
