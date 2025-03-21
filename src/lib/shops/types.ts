
export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  rating: number;
  reviewCount: number;
  productIds: string[];
  isVerified: boolean;
  createdAt: string;
  shopId?: string; // For admin access
  ownerName?: string; // Owner name
  ownerEmail?: string; // Owner email
  status?: 'pending' | 'active' | 'suspended'; // Shop status
}
