
import { User } from '@supabase/supabase-js';

// Extended user type with additional fields for user profile
export interface ExtendedUser extends Omit<User, 'user_metadata'> {
  id: string;
  uid?: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  avatarUrl?: string | null;
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
  role?: UserRole;
  preferences?: {
    theme?: string;
    currency?: string;
    language?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

export type UserRole = 'user' | 'shop_admin' | 'admin';

export type Theme = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  preferences?: {
    theme?: string;
    currency?: string;
    language?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  email_confirmed_at?: string;
}

export interface AuthContextType {
  currentUser: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<{ success: boolean; message: string }>;
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
