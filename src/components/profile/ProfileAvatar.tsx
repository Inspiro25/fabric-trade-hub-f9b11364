
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileAvatarProps = {
  photoURL: string | null;
  displayName: string;
  email: string;
  phoneNumber: string;
  editMode: boolean;
};

const ProfileAvatar = ({ 
  photoURL, 
  displayName, 
  email,
  phoneNumber,
  editMode 
}: ProfileAvatarProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex flex-col items-center mb-6 relative">
      <div className={cn(
        "absolute inset-0 -z-10 rounded-full blur-3xl opacity-20 w-32 h-32 mx-auto",
        isDarkMode ? "bg-orange-500" : "bg-blue-500"
      )}></div>
      
      <Avatar className={cn(
        "h-24 w-24 mb-3 border-4",
        isDarkMode ? "border-gray-800" : "border-white"
      )}>
        <AvatarImage src={photoURL || undefined} alt={displayName} />
        <AvatarFallback className={cn(
          "text-2xl",
          isDarkMode ? "bg-gray-700 text-orange-300" : "bg-blue-100 text-blue-600"
        )}>
          {getInitials(displayName) || getInitials(email) || '?'}
        </AvatarFallback>
      </Avatar>
      
      {!editMode && (
        <>
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-white" : ""
          )}>
            {displayName || 'User'}
          </h2>
          
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {email || 'No email provided'}
          </p>
          
          {phoneNumber && (
            <p className={cn(
              "text-xs mt-1",
              isDarkMode ? "text-gray-500" : "text-gray-500"
            )}>
              {phoneNumber}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
