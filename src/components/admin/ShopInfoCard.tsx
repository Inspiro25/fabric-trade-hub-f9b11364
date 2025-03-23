
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shop } from '@/lib/shops/types';

interface ShopInfoCardProps {
  shop: Shop;
}

const ShopInfoCard: React.FC<ShopInfoCardProps> = ({ shop }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Shop Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Owner:</span>
            <span className="font-medium">{shop.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="font-medium">{shop.ownerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone:</span>
            <span className="font-medium">{shop.phoneNumber || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Address:</span>
            <span className="font-medium">{shop.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium capitalize">{shop.status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopInfoCard;
