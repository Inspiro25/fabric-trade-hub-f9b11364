
import * as z from 'zod';

// Define the shop form schema
export const shopSchema = z.object({
  name: z.string().min(2, { message: 'Shop name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }).optional(),
  status: z.enum(['active', 'pending', 'suspended']),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }).optional(),
  logo: z.string().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).optional(),
  coverImage: z.string().optional(),
  isVerified: z.boolean().default(false),
  shopId: z.string().optional(),
  ownerName: z.string().min(2, { message: 'Owner name must be at least 2 characters' }).optional(),
  ownerEmail: z.string().email({ message: 'Invalid email address' }).optional(),
  phoneNumber: z.string().optional(),
});

// Define the form values type based on the schema
export type ShopFormValues = z.infer<typeof shopSchema>;
