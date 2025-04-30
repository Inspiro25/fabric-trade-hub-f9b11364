
import { Dispatch, SetStateAction } from 'react';
import { ExtendedUser } from '@/types/auth';

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
