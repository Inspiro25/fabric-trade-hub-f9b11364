
export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  cover_image: string;
  rating: number;
  review_count: number;
  followers_count: number;
  owner_name: string;
  owner_email: string;
  phone_number: string;
  address: string;
  status: string;
  is_verified: boolean;
}

export interface ShopFollower {
  id: string;
  shop_id: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url: string;
  followed_at: string;
}

export interface ShopAnalytics {
  id: string;
  shop_id: string;
  date: string;
  sales_amount: number;
  orders_count: number;
  created_at: string;
}

export interface ShopFilter {
  id: string;
  name: string;
  rating?: number;
  is_verified?: boolean;
}
