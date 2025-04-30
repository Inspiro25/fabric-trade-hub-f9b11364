

export interface ShopFormValues {
  name: string;
  shopId: string;
  phoneNumber: string;
  address: string;
  password: string;
  description: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  status: "active" | "pending" | "suspended";
}

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  coverImage?: string; // Add this for compatibility
  address?: string;
  phone_number?: string;
  phoneNumber?: string; // Add this for compatibility
  rating: number;
  review_count: number;
  reviewCount: number;
  followers_count: number;
  followersCount: number;
  owner_name?: string;
  ownerName?: string; // Add this for compatibility
  owner_email?: string;
  ownerEmail?: string; // Add this for compatibility
  status?: "active" | "pending" | "suspended";
  is_verified?: boolean;
  isVerified?: boolean; // Add this for compatibility
  created_at?: string;
  productIds?: string[]; // Add this for compatibility with products.ts
}

