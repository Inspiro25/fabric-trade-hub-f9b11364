import { User } from '@supabase/supabase-js';
import { Json } from './supabase';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  preferences: Json;
  created_at: string;
  updated_at?: string;
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
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isSupabaseAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string) => Promise<User | null>;
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
