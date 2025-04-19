
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileFormProps = {
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
};

const ProfileForm = ({
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
  emailDisabled = false,
}: ProfileFormProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName" className={isDarkMode ? "text-gray-300" : ""}>
          Display Name
        </Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className={cn(
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
              : "bg-white"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className={isDarkMode ? "text-gray-300" : ""}>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={emailDisabled}
          className={cn(
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
              : "bg-white",
            emailDisabled && isDarkMode && "bg-gray-800 text-gray-400"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className={isDarkMode ? "text-gray-300" : ""}>
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Your phone number"
          className={cn(
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
              : "bg-white"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" className={isDarkMode ? "text-gray-300" : ""}>
          Address
        </Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Your address"
          className={cn(
            isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400" 
              : "bg-white"
          )}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className={cn(
          "w-full mt-4",
          isDarkMode 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
