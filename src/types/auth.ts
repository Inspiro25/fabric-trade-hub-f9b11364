
import { User } from '@supabase/supabase-js';

// Extended user type with additional fields for user profile
export interface ExtendedUser extends User {
  user_metadata?: {
    full_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
    preferred_language?: string;
    theme?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  phone?: string;
  address?: string;
  email_confirmed_at?: string;
}

export type UserRole = 'user' | 'shop_admin' | 'admin';

export type Theme = 'light' | 'dark' | 'system';

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<ExtendedUser>) => Promise<{ success: boolean; message: string }>;
  updateTheme: (theme: Theme) => Promise<void>;
  userRole: UserRole;
}

// Define the type for user preferences
export interface UserPreferences {
  role?: UserRole;
  theme?: string;
  currency?: string;
  language?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
