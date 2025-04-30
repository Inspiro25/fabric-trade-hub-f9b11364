
export type ShopStatus = 'active' | 'pending' | 'suspended';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  cover_image: string;
  address: string;
  is_verified: boolean;
  shop_id: string;
  owner_name: string;
  owner_email: string;
  status: ShopStatus;
  password: string;
  phone_number: string;
  rating: number;
  review_count: number;
  followers_count: number;
  created_at: string;
  updated_at?: string;
}

export interface ShopWithProducts extends Shop {
  products: Array<{
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    images: string[];
    rating: number;
    review_count: number;
  }>;
}
