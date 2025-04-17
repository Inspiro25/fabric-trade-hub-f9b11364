
export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  description: string;
  category_id: string;
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  review_count: number;
  shop_id: string | null;
  is_new: boolean;
  is_trending: boolean;
  tags: string[];
}
