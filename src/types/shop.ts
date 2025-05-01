
import { ShopStatus } from "@/lib/shops/types";

// Define ShopFormValues interface to be used in ShopForm and related components
export interface ShopFormValues {
  name: string; // Required property
  description: string; // Required per shopSchema
  address: string; // Required per shopSchema
  status: ShopStatus; // Required per shopSchema
  password: string; // Required per shopSchema
  shopId: string; // Required per shopSchema
  logo: string; // Required per shopSchema
  coverImage: string; // Required per shopSchema
  isVerified: boolean; // Required per shopSchema
  ownerName: string; // Required per shopSchema
  ownerEmail: string; // Required per shopSchema
  phoneNumber: string; // Required per shopSchema
}

// Other shop related types can be added here as needed
