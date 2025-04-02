
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import ProfileCard from './ProfileCard';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type AuthenticatedViewProps = {
  isLoaded: boolean;
  currentUser: any;
  displayName: string;
  setDisplayName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  editMode: boolean;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => Promise<void>;
  getCartCount: () => number;
};

const AuthenticatedView = ({
  isLoaded,
  currentUser,
  displayName,
  setDisplayName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  editMode,
  isLoading,
  handleSubmit,
  handleLogout,
  getCartCount
}: AuthenticatedViewProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "max-w-md mx-auto p-4 transition-all duration-500",
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    )}>
      <ProfileAvatar
        photoURL={currentUser?.photoURL}
        displayName={displayName}
        email={email}
        phoneNumber={phoneNumber}
        editMode={editMode}
      />
      
      <ProfileStats cartCount={getCartCount()} />
      
      <ProfileActions onLogout={handleLogout} />
      
      <ProfileCard
        editMode={editMode}
        displayName={displayName}
        setDisplayName={setDisplayName}
        email={email}
        setEmail={setEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        address={address}
        setAddress={setAddress}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        currentUser={currentUser}
      />
    </div>
  );
};

export default AuthenticatedView;
