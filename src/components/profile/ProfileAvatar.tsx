
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileAvatarProps {
  avatarUrl?: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  editMode: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  displayName,
  email,
  phoneNumber,
  editMode
}) => {
  const [uploading, setUploading] = useState(false);
  const { updateProfile } = useAuth();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      setUploading(true);
      
      // Create a mock URL for the uploaded file
      // In a real app, you would upload this to a storage service
      const mockAvatarUrl = URL.createObjectURL(file);
      
      if (updateProfile) {
        await updateProfile({ photoURL: mockAvatarUrl });
        toast.success("Profile picture updated");
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-blue-500 cursor-pointer">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="text-2xl">
            {displayName ? displayName.charAt(0).toUpperCase() : email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {editMode && (
          <div className="absolute -bottom-1 -right-1">
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
            <label htmlFor="avatar-upload">
              <Button size="sm" variant="secondary" className="h-8 w-8 rounded-full p-0" asChild>
                <div>
                  <Pencil className="h-4 w-4" />
                </div>
              </Button>
            </label>
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-4">{displayName}</h3>
      <p className="text-gray-500 text-sm">{email}</p>
      {phoneNumber && <p className="text-gray-500 text-sm">{phoneNumber}</p>}
    </div>
  );
};

export default ProfileAvatar;
