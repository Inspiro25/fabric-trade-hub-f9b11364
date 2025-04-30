
import { User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  phone?: string;
  email_confirmed_at?: string;
  address?: string;
  uid?: string; // Add uid for compatibility with OrderContext.tsx
  // Add any other properties that might be used in the application
}

export interface UserProfile {
  id: string;
  display_name: string;
  displayName?: string; // Add this for compatibility
  email: string;
  avatar_url?: string;
  avatarUrl?: string; // Add this for compatibility
  phone?: string;
  address?: string;
  preferences?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  savedAddresses?: Array<{
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    phoneNumber?: string;
  }>;
}
