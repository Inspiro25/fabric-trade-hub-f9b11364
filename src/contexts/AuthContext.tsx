
import { createContext, useContext, ReactNode } from 'react';
import { useAuthProvider } from '@/hooks/useAuthProvider';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  verifyEmail: () => Promise<void>;
  loginWithGoogleProvider?: () => Promise<any>;
  loginWithFacebookProvider?: () => Promise<any>;
  setDefaultAddress?: (addressId: string) => Promise<void>;
  // Legacy properties for backward compatibility
  user?: User | null;
  signIn?: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
