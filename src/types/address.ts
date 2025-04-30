
export interface Address {
  id: string;
  user_id: string;
  name: string;
  full_name?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressFormData = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  isLoading: boolean;
  error: Error | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: AddressFormData) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  selectAddress: (address: Address) => void;
} 
