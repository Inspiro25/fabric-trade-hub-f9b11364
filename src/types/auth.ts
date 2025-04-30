
import { User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  phone?: string;
  address?: string;
  displayName?: string;
  avatarUrl?: string;
  email_confirmed_at?: string;
  // Add other custom properties as needed
}

// Add other auth related types here
