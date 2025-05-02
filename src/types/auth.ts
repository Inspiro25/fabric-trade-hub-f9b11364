
import { User } from '@supabase/supabase-js';

export interface ExtendedUser {
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    address?: string;
    [key: string]: any;
  };
  phone?: string;
  address?: string;
  email_confirmed_at?: string;
  displayName?: string;
  photoURL?: string;
  avatarUrl?: string;
  uid?: string;
  preferences?: UserPreferences;
  savedAddresses?: Address[];
  role?: string;
  email?: string | null;
  id?: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  theme?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  language?: string;
  role?: string;
  [key: string]: any;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: ExtendedUser | null; error: Error | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: ExtendedUser | null; error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any | null; error: Error | null }>;
  updateUser: (data: Partial<ExtendedUser>) => Promise<{ user: ExtendedUser | null; error: Error | null }>;
  updatePassword: (password: string) => Promise<{ data: any | null; error: Error | null }>;
  sendMagicLink: (email: string) => Promise<{ data: any | null; error: Error | null }>;
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  twitterSignIn: () => Promise<void>;
  appleSignIn: () => Promise<void>;
}
