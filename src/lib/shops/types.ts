
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
  status: 'active' | 'pending' | 'suspended';
  is_verified: boolean;
  created_at?: string;
  shop_id?: string;
  password?: string;
}

// Helper function to adapt from database schema naming to frontend camelCase naming
export const adaptShop = (shop: Shop): any => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo: shop.logo,
    coverImage: shop.cover_image,
    rating: shop.rating,
    reviewCount: shop.review_count,
    followersCount: shop.followers_count,
    ownerName: shop.owner_name,
    ownerEmail: shop.owner_email,
    phoneNumber: shop.phone_number,
    address: shop.address,
    status: shop.status,
    isVerified: shop.is_verified,
    createdAt: shop.created_at,
    shopId: shop.shop_id,
    password: shop.password
  };
};

// Helper function to convert camelCase to DB schema naming
export const adaptShopForDb = (shop: any): Partial<Shop> => {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description,
    logo: shop.logo,
    cover_image: shop.coverImage,
    rating: shop.rating,
    review_count: shop.reviewCount,
    followers_count: shop.followersCount,
    owner_name: shop.ownerName,
    owner_email: shop.ownerEmail,
    phone_number: shop.phoneNumber,
    address: shop.address,
    status: shop.status as 'active' | 'pending' | 'suspended',
    is_verified: shop.isVerified,
    created_at: shop.createdAt,
    shop_id: shop.shopId,
    password: shop.password
  };
};

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
