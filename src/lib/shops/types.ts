
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

// Helper function to adapt shop data from database
export function adaptShopData(shopData: any): Shop {
  return {
    id: shopData.id || '',
    name: shopData.name || '',
    logo: shopData.logo || '',
    cover_image: shopData.cover_image || '',
    description: shopData.description || '',
    owner_name: shopData.owner_name || '',
    owner_email: shopData.owner_email || '',
    address: shopData.address || '',
    phone: shopData.phone_number || shopData.phone || '',
    phone_number: shopData.phone_number || shopData.phone || '',
    website: shopData.website || '',
    social_media: shopData.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
    categories: shopData.categories || [],
    is_verified: shopData.is_verified || false,
    rating: shopData.rating || 0,
    review_count: shopData.review_count || 0,
    followers_count: shopData.followers_count || 0,
    product_count: shopData.product_count || 0,
    created_at: shopData.created_at || new Date().toISOString(),
    tags: shopData.tags || [],
    status: shopData.status || 'pending',
    shop_id: shopData.shop_id || ''
  };
}
