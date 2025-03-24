
export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  cover_image: string;
  address: string;
  phone_number?: string;
  owner_name: string;
  owner_email: string;
  password?: string;
  rating: number;
  review_count: number;
  followers_count: number;
  is_verified: boolean;
  status: string;
  created_at: string;
  shop_id?: string;
  product_count: number;
}

// Add ShopStatus enum that's referenced in the error
export enum ShopStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SUSPENDED = "suspended"
}
