
export interface ExtendedUser {
  id: string;
  uid?: string;
  email: string;
  display_name?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  phone?: string;
  address?: string;
  email_confirmed_at?: string;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  isShopOwner: boolean;
  isLoggedIn: boolean;
  isInitialized: boolean;
  register: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  fetchUserProfile: (userId: string) => Promise<any>;
}

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
