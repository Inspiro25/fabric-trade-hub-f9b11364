
import { User } from 'firebase/auth';

export interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  savedAddresses?: {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme?: string;
    currency?: string;
    language?: string;
  };
  avatarUrl?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>; // Updated to match implementation
  register: (email: string, password: string) => Promise<UserProfile | null>; // Updated to match implementation
  loginWithGoogleProvider: () => Promise<UserProfile | null>; // Updated to match implementation
  loginWithFacebookProvider: () => Promise<UserProfile | null>; // Updated to match implementation
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>; // Updated to match implementation
  addAddress: (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => Promise<string | undefined>;
  updateAddress: (address: UserProfile['savedAddresses'][0]) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
}
