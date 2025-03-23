
export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string; // Changed from cover_image
  address: string;
  ownerName: string; // Changed from owner_name
  ownerEmail: string; // Changed from owner_email
  phoneNumber: string; // Changed from phone_number
  rating: number;
  reviewCount: number; // Added to match expected type
  followers: number; // Changed from followers_count
  productIds: string[]; // Added to match expected type
  isVerified: boolean; // Changed from is_verified 
  status: string;
  createdAt: string; // Changed from created_at
}

export interface ShopSummary {
  id: string;
  name: string;
  logo: string;
  rating: number;
  followers: number;
  productCount: number;
  isVerified: boolean;
}

export interface ShopFilter {
  category?: string;
  minRating?: number;
  verified?: boolean;
  sortBy?: 'popular' | 'rating' | 'newest';
}
