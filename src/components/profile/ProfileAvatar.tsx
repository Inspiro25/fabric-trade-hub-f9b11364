import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Upload, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const { updateUserProfile } = useAuth();
  const [showUploader, setShowUploader] = useState(false);
  
  const handleAvatarUpload = async (url: string) => {
    try {
      await updateUserProfile({ avatarUrl: url });
      toast.success('Profile picture updated successfully');
      setShowUploader(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };
  
  return (
    <div className="flex flex-col items-center mb-6 relative">
      <div className={cn(
        "absolute inset-0 -z-10 rounded-full blur-3xl opacity-20 w-32 h-32 mx-auto",
        isDarkMode ? "bg-blue-500" : "bg-blue-500"
      )}></div>
      
      <div className="relative">
        <Avatar className={cn(
          "h-24 w-24 mb-3 border-4",
          isDarkMode ? "border-gray-800" : "border-white"
        )}>
          <AvatarImage src={photoURL || undefined} alt={displayName} />
          <AvatarFallback className={cn(
            "text-2xl",
            isDarkMode ? "bg-gray-700 text-blue-300" : "bg-blue-100 text-blue-600"
          )}>
            {getInitials(displayName) || getInitials(email) || '?'}
          </AvatarFallback>
        </Avatar>
        
        <Button 
          type="button"
          size="icon"
          variant="secondary"
          className={cn(
            "absolute bottom-2 right-0 rounded-full h-8 w-8 shadow-md border",
            isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
          )}
          onClick={() => setShowUploader(!showUploader)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit profile picture</span>
        </Button>
      </div>
      
      {showUploader && (
        <div className={cn(
          "w-full max-w-sm mt-4 p-3 rounded-lg animate-in fade-in-50 zoom-in-95",
          isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
        )}>
          <FileUpload
            onUploadComplete={handleAvatarUpload}
            initialImage={photoURL || undefined}
            bucketName="avatars"
            folderPath="profile"
            fileTypes="image/*"
            maxSize={2}
          />
        </div>
      )}
      
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
