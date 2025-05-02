
import { z } from 'zod';

export interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  cover_image?: string;
  address?: string;
  phone_number?: string;
  owner_name?: string;
  owner_email?: string;
  status?: 'active' | 'pending' | 'suspended';
  is_verified?: boolean;
  rating?: number;
  review_count?: number;
  followers_count?: number;
  shop_id?: string;
  created_at?: string;
}

export const shopFormSchema = z.object({
  name: z.string().min(2, "Shop name must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  shopId: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email("Please enter a valid email").optional(),
  status: z.enum(['active', 'pending', 'suspended']).optional().default('pending'),
  password: z.string().optional(),
  isVerified: z.boolean().optional().default(false)
});

export interface ShopFormValues {
  name: string;
  logo?: string;
  description?: string;
  shopId?: string;
  address?: string;
  password?: string;
  phoneNumber?: string;
  coverImage?: string;
  isVerified?: boolean;
  ownerName?: string;
  ownerEmail?: string;
  status?: 'active' | 'pending' | 'suspended';
}

export interface ShopFormProps {
  initialValues?: Partial<ShopFormValues>;
  onSubmit: (values: ShopFormValues) => void;
  isLoading?: boolean;
  submitText?: string;
  title?: string;
}
