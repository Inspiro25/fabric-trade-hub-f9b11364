
import { User } from '@supabase/supabase-js';

export interface ExtendedUser {
  id: string;
  email?: string | null;
  phone?: string;
  address?: string;
  displayName?: string | null;
  display_name?: string | null;
  photoURL?: string | null;
  avatarUrl?: string | null;
  email_confirmed_at?: string;
  uid?: string;
  user_metadata?: any;
  app_metadata?: any;
  aud: string;
  created_at: string;
  metadata?: any;
  preferences?: Record<string, any>;
}

// Add other auth related types here
export interface UserProfile {
  id: string;
  display_name: string;
  displayName?: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: Record<string, any>;
  avatar_url?: string;
  avatarUrl?: string;
  email_confirmed_at?: string;
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
  }>;
}
