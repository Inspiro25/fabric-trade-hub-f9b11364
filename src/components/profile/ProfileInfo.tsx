import React from 'react';
import { Separator } from '@/components/ui/separator';
import { User, AtSign, Phone, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileInfoProps = {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

const ProfileInfo = ({ displayName, email, phoneNumber, address }: ProfileInfoProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="space-y-4">
      <InfoItem 
        icon={<User className={isDarkMode ? "text-blue-400" : "text-blue-500"} />} 
        label="Display Name" 
        value={displayName || 'Not provided'} 
      />
      
      <Separator className={isDarkMode ? "bg-gray-700" : ""} />
      
      <InfoItem 
        icon={<AtSign className={isDarkMode ? "text-blue-400" : "text-blue-500"} />} 
        label="Email" 
        value={email || 'Not provided'} 
      />
      
      <Separator className={isDarkMode ? "bg-gray-700" : ""} />
      
      <InfoItem 
        icon={<Phone className={isDarkMode ? "text-blue-400" : "text-blue-500"} />} 
        label="Phone Number" 
        value={phoneNumber || 'Not provided'} 
      />
      
      <Separator className={isDarkMode ? "bg-gray-700" : ""} />
      
      <InfoItem 
        icon={<Home className={isDarkMode ? "text-blue-400" : "text-blue-500"} />} 
        label="Address" 
        value={address || 'Not provided'} 
      />
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-0.5">{icon}</div>
      <div>
        <p className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {label}
        </p>
        <p className={isDarkMode ? "text-white" : "text-gray-900"}>{value}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
