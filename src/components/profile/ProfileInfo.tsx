
import React from 'react';
import { Label } from '@/components/ui/label';

type ProfileInfoProps = {
  displayName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

const ProfileInfo = ({ displayName, email, phoneNumber, address }: ProfileInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="displayName" className="text-xs text-gray-500">Full Name</Label>
        <p>{displayName || "Not provided"}</p>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs text-gray-500">Email Address</Label>
        <p>{email || "Not provided"}</p>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="phoneNumber" className="text-xs text-gray-500">Phone Number</Label>
        <p>{phoneNumber || "Not provided"}</p>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="address" className="text-xs text-gray-500">Address</Label>
        <p className="whitespace-pre-line">{address || "Not provided"}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
