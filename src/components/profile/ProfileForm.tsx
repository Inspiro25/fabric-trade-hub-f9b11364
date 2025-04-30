
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export interface ProfileFormProps {
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
  emailDisabled?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
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
  emailDisabled = false
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input 
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          disabled={emailDisabled}
          className={cn(
            isDarkMode ? "bg-gray-700 border-gray-600" : "",
            emailDisabled && "opacity-50"
          )}
        />
        {emailDisabled && (
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input 
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Your phone number"
          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Your address"
          rows={3}
          className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : 'Save Profile'}
      </Button>
    </form>
  );
};

export default ProfileForm;
