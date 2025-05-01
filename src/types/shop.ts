
// Import types from other modules if needed
import { z } from 'zod';

// Basic Shop interface
export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  followers?: number;
  followersCount?: number;
  address?: string;
  isVerified?: boolean;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  status?: 'active' | 'pending' | 'suspended';
}

// Form values for shop creation/editing
export interface ShopFormValues {
  name: string;
  description: string;
  shopId: string;
  address: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  status: 'active' | 'pending' | 'suspended';
  password: string;
  phoneNumber: string;
}

// Schema for shop form validation
export const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  shopId: z.string(),
  address: z.string(),
  logo: z.string(),
  coverImage: z.string(),
  isVerified: z.boolean(),
  ownerName: z.string(),
  ownerEmail: z.string().email("Invalid email address"),
  status: z.enum(['active', 'pending', 'suspended']),
  password: z.string(),
  phoneNumber: z.string(),
});

// Extended shop interface with additional fields
export interface ExtendedShop extends Shop {
  productsCount?: number;
  followers?: number;
  categories?: {
    id: string;
    name: string;
  }[];
}
