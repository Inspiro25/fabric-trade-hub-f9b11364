
import React from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfileAvatarProps = {
  photoURL?: string | null;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  editMode: boolean;
};

const ProfileAvatar = ({ photoURL, displayName, email, phoneNumber, editMode }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-3">
        <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
          <AvatarImage src={photoURL || ""} alt="Profile picture" />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
            {displayName?.[0] || email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        {editMode && (
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
            <Camera size={16} />
          </button>
        )}
      </div>
      <h2 className="text-lg font-medium">{displayName || "Guest User"}</h2>
      <p className="text-sm text-gray-500 mb-1">{email}</p>
      {phoneNumber && <p className="text-xs text-gray-400">{phoneNumber}</p>}
    </div>
  );
};

export default ProfileAvatar;
