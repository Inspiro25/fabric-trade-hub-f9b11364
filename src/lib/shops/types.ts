
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
  product_count?: number; // Added product_count
  created_at: string;
  tags: string[];
  status: string;
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
