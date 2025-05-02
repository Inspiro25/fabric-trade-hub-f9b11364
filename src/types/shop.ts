
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
