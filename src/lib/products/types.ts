
// Export the Product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  images: string[];
  category_id: string;
  shop_id?: string;
  rating: number;
  review_count: number;
  stock: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  is_new?: boolean;
  is_trending?: boolean;
  created_at: string;
}

// Add any additional product-related types here
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  images?: string[];
}
