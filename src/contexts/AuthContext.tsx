
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { useAuthProvider } from '@/hooks/useAuthProvider';

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isSupabaseAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | undefined>;
  register: (email: string, password: string) => Promise<User | undefined>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => Promise<void>;
  updateAddress: (address: UserProfile['savedAddresses'][0]) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
