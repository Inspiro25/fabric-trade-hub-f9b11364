
export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  cover_image?: string; 
  address: string;
  ownerName: string;
  ownerEmail: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  followers: number;
  followers_count?: number;
  productIds: string[];
  isVerified: boolean;
  status: "pending" | "active" | "suspended";
  createdAt: string;
  shopId?: string;
  password?: string;
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
