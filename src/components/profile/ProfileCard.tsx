
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import ProfileForm from './ProfileForm';
import ProfileInfo from './ProfileInfo';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileCardProps = {
  editMode: boolean;
  displayName: string;
  setDisplayName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  currentUser: any | null;
};

const ProfileCard = ({
  editMode,
  displayName,
  setDisplayName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  isLoading,
  handleSubmit,
  currentUser
}: ProfileCardProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-md",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <CardHeader className={cn(
        "p-4",
        isDarkMode 
          ? "bg-gradient-to-r from-gray-800 to-gray-700" 
          : "bg-gradient-to-r from-blue-50 to-indigo-50"
      )}>
        <CardTitle className={cn(
          "text-lg",
          isDarkMode ? "text-white" : ""
        )}>
          Personal Information
        </CardTitle>
        {!editMode && (
          <CardDescription className={isDarkMode ? "text-gray-300" : ""}>
            Your basic information
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4">
        {editMode ? (
          <ProfileForm
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
            emailDisabled={!!currentUser?.email}
          />
        ) : (
          <ProfileInfo
            displayName={displayName}
            email={email}
            phoneNumber={phoneNumber}
            address={address}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
