
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
  children: React.ReactNode;
};

const ProfileCard = ({
  children,
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
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
