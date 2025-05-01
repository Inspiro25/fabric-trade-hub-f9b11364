
import { ShopStatus } from "@/lib/shops/types";

// Define ShopFormValues interface to be used in ShopForm and related components
export interface ShopFormValues {
  name: string; // Required property
  description?: string;
  address?: string;
  status?: ShopStatus;
  password?: string;
  shopId?: string;
  logo?: string;
  coverImage?: string;
  isVerified?: boolean;
  ownerName?: string;
  ownerEmail?: string;
  phoneNumber?: string;
}

// Other shop related types can be added here as needed
