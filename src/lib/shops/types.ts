
export type ShopStatus = "active" | "pending" | "suspended";

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  cover_image: string;
  address: string;
  phone_number: string;
  owner_name: string;
  owner_email: string;
  status: ShopStatus;
  is_verified: boolean;
  rating: number;
  review_count: number;
  followers_count: number;
  product_count: number;
  created_at: string;
  product_ids?: string[];
  shop_id?: string; // Adding this property that's used in some components
}

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  images: string[];
  description: string;
  category_id: string;
  shop_id: string;
}
