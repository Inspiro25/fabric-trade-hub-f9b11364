import { User } from '@supabase/supabase-js';

export interface ExtendedUser extends User {
  phone?: string;
  email_confirmed_at?: string;
  // Add any other properties that might be used in the application
}
