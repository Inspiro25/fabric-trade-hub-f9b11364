
export interface Shop {
  id: string;
  name: string;
  logo: string;
  cover_image: string;
  description: string;
  owner_name: string;
  owner_email: string;
  address: string;
  phone: string;
  phone_number?: string; // For backward compatibility
  website: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    pinterest?: string;
  };
  categories: string[];
  is_verified: boolean;
  rating: number;
  followers_count: number;
  review_count?: number; // Added review_count
  product_count?: number; // Added product_count
  created_at: string;
  tags: string[];
  status: string;
  shop_id?: string; // Added for backward compatibility
}

export enum ShopStatus {
  Active = "active",
  Pending = "pending",
  Suspended = "suspended",
  Closed = "closed"
}

export interface ShopWithProducts extends Shop {
  products: any[];
}

export interface ShopFollower {
  id: string;
  shop_id: string;
  user_id: string;
  created_at: string;
}

export interface FollowersResponse {
  count: number;
  followers: ShopFollower[];
}

export interface ShopStatsResponse {
  followers_count: number;
  orders_count: number;
  products_count: number;
  revenue: number;
}
