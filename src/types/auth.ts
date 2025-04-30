
import { User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  phone?: string;
  address?: string;
  displayName?: string;
  avatarUrl?: string;
  email_confirmed_at?: string;
  uid?: string; // Added for compatibility with existing code
  display_name?: string; // Added for backward compatibility
  preferences?: Record<string, any>; // Added for compatibility with existing code
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
}
