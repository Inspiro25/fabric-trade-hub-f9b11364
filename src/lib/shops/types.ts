
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

// Alias properties for frontend convenience
export interface ShopDisplay extends Omit<Shop, 'cover_image' | 'is_verified' | 'owner_name' | 'owner_email' | 'phone_number' | 'review_count' | 'followers_count' | 'created_at'> {
  coverImage: string;
  isVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  phoneNumber: string;
  reviewCount: number;
  followers: number;
  createdAt: string;
}

// Conversion helper
export const convertToDisplayShop = (shop: Shop): ShopDisplay => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo: shop.logo,
    coverImage: shop.cover_image,
    address: shop.address,
    isVerified: shop.is_verified,
    shop_id: shop.shop_id,
    ownerName: shop.owner_name,
    ownerEmail: shop.owner_email,
    status: shop.status,
    password: shop.password,
    phoneNumber: shop.phone_number,
    rating: shop.rating,
    reviewCount: shop.review_count,
    followers: shop.followers_count,
    createdAt: shop.created_at,
    updated_at: shop.updated_at
  };
};
