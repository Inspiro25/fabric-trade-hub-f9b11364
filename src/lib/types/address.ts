export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface AddressFormData extends Omit<Address, 'id' | 'isDefault'> {
  isDefault?: boolean;
}

export interface DeliveryLocation {
  city: string;
  state: string;
  postalCode: string;
  isSelected: boolean;
} 