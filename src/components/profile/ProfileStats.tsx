
import React from 'react';
import { ShoppingBag, Package, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileStatsProps = {
  cartCount: number;
};

const ProfileStats = ({ cartCount }: ProfileStatsProps) => {
  const { isDarkMode } = useTheme();
  
  // Stats data
  const stats = [
    {
      id: 'cart',
      label: 'In Cart',
      value: cartCount,
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      id: 'orders',
      label: 'Orders',
      value: 0, // This would be fetched from an API in a real app
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      value: 0, // This would be fetched from an API in a real app
      icon: <Heart className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className={cn(
            "flex flex-col items-center justify-center py-3 px-2 rounded-lg",
            isDarkMode 
              ? "bg-gray-800 text-white" 
              : "bg-white shadow-sm"
          )}
        >
          <div className={cn(
            "p-2 rounded-full mb-1",
            isDarkMode 
              ? "bg-gray-700 text-orange-400" 
              : "bg-orange-100 text-orange-600"
          )}>
            {stat.icon}
          </div>
          <p className="text-xl font-semibold">{stat.value}</p>
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
