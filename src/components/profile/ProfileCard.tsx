
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
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <CardTitle className="text-lg">Personal Information</CardTitle>
        {!editMode && (
          <CardDescription>Your basic information</CardDescription>
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
