import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id?: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  savedAddresses?: {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme?: string;
    currency?: string;
    language?: string;
  };
  avatarUrl?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isSupabaseAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => Promise<void>;
  updateAddress: (address: UserProfile['savedAddresses'][0]) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}
