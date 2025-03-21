
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Heart, Bell } from 'lucide-react';

type ProfileStatsProps = {
  cartCount: number;
};

const ProfileStats = ({ cartCount }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      <Card className="bg-white overflow-hidden border-none shadow-sm">
        <CardContent className="p-3 text-center">
          <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-blue-500" />
          <p className="text-xl font-semibold">{cartCount}</p>
          <p className="text-xs text-gray-500">Cart Items</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white overflow-hidden border-none shadow-sm">
        <CardContent className="p-3 text-center">
          <Heart className="h-5 w-5 mx-auto mb-1 text-rose-500" />
          <p className="text-xl font-semibold">0</p>
          <p className="text-xs text-gray-500">Wishlist</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white overflow-hidden border-none shadow-sm">
        <CardContent className="p-3 text-center">
          <Bell className="h-5 w-5 mx-auto mb-1 text-amber-500" />
          <p className="text-xl font-semibold">0</p>
          <p className="text-xs text-gray-500">Notifications</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;
