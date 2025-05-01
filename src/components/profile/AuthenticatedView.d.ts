
import { ExtendedUser } from '@/types/auth';
import { Dispatch, SetStateAction } from 'react';

export interface AuthenticatedViewProps {
  isLoaded: boolean;
  currentUser: ExtendedUser;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  editMode: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => Promise<void>;
  getCartCount: () => number;
}
