// Define the core Product type that will be used throughout the application
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  images: string[];
  category: string;
  category_id?: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  is_new?: boolean;
  isTrending: boolean;
  is_trending?: boolean;
  rating: number;
  reviewCount: number;
  review_count?: number;
  stock: number;
  tags: string[];
  shopId: string;
  shop_id?: string;
  brand?: string;
  shopName?: string;
  categoryId?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the SearchPageProduct type with required fields
export interface SearchPageProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  sale_price?: number;
  images?: string[];
  category?: string;
  category_id?: string;
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  is_new?: boolean;
  isTrending?: boolean;
  is_trending?: boolean;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  stock?: number;
  tags?: string[];
  shopId?: string;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
}
