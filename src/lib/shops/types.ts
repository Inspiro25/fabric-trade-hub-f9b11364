
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

// Alias properties for frontend convenience with camelCase naming
export interface ShopDisplay {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  isVerified: boolean;
  shopId: string;
  ownerName: string;
  ownerEmail: string;
  status: ShopStatus;
  password: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  followers: number;
  createdAt: string;
  updated_at?: string;
}

// Conversion helper function for clean conversion between snake_case and camelCase
export const convertToDisplayShop = (shop: Shop): ShopDisplay => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo: shop.logo,
    coverImage: shop.cover_image,
    address: shop.address,
    isVerified: shop.is_verified,
    shopId: shop.shop_id,
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

// Export Product type to be used across the application
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
