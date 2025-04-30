
export interface ShopFormValues {
  name: string;
  description: string;
  shopId: string;
  phoneNumber: string;
  address: string;
  password: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  ownerName: string;
  ownerEmail: string;
  status: "active" | "pending" | "suspended";
}
