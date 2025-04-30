
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Mail, Phone, MapPin } from 'lucide-react';

export interface ProfileInfoProps {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  displayName,
  email,
  phoneNumber,
  address
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "space-y-4 p-4 rounded-lg",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <h2 className="text-xl font-semibold mb-4">{displayName}'s Profile</h2>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Mail className="w-5 h-5 mr-3 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{email || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Phone className="w-5 h-5 mr-3 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{phoneNumber || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-3 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{address || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
