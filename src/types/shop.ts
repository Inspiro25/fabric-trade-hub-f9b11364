
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
  coverImage?: string;
  address?: string;
  phone_number?: string;
  phoneNumber?: string;
  rating: number;
  review_count: number;
  reviewCount: number;
  followers_count: number;
  followersCount: number;
  owner_name?: string;
  ownerName?: string;
  owner_email?: string;
  ownerEmail?: string;
  status?: "active" | "pending" | "suspended";
  is_verified?: boolean;
  isVerified?: boolean;
  created_at?: string;
  productIds?: string[]; // Add this to fix the productIds property error
}
