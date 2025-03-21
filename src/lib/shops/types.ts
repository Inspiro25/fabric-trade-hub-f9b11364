
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
}
