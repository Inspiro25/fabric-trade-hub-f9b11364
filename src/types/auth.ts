
import { User } from '@supabase/supabase-js';

export interface ExtendedUser {
  id: string;
  email?: string | null;
  phone?: string;
  address?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  email_confirmed_at?: string;
  uid?: string; // Added for compatibility with existing code
  display_name?: string; // Added for backward compatibility
  preferences?: Record<string, any>; // Added for compatibility with existing code
  // Required properties from User that might be used
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
  // Add other custom properties as needed
}

// Add other auth related types here
export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: Record<string, any>;
  avatar_url?: string;
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
