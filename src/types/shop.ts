
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
  description?: string;
  shopId?: string;
  address?: string;
  logo?: string;
  coverImage?: string;
  isVerified?: boolean;
  ownerName?: string;
  ownerEmail?: string;
  status?: 'active' | 'pending' | 'suspended';
  password?: string;
  phoneNumber?: string;
}

// Schema for shop form validation
export const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  shopId: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  isVerified: z.boolean().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email("Invalid email address").optional(),
  status: z.enum(['active', 'pending', 'suspended']).optional(),
  password: z.string().optional(),
  phoneNumber: z.string().optional(),
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
