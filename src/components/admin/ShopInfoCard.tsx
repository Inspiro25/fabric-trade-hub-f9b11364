
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shop, convertToDisplayShop } from '@/lib/shops/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail, MapPin, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';

interface ShopInfoCardProps {
  shop: Shop;
}

const ShopInfoCard: React.FC<ShopInfoCardProps> = ({ shop }) => {
  const { isDarkMode } = useTheme();
  const displayShop = convertToDisplayShop(shop);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card className={cn(
      "h-full",
      isDarkMode ? "border-gray-700" : "border-gray-200"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Shop Information</span>
          <Badge 
            variant={
              shop.status === 'active' ? 'success' : 
              shop.status === 'pending' ? 'warning' : 'destructive'
            }
            className="text-[10px] h-5"
          >
            {shop.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner</p>
              <p className="font-medium text-sm">{displayShop.ownerName}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-sm break-all">{displayShop.ownerEmail}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-sm">{displayShop.phoneNumber || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
              <p className="font-medium text-sm">{shop.address}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
              <p className="font-medium text-sm">{formatDate(displayShop.createdAt)}</p>
            </div>
          </div>
          
          {displayShop.isVerified && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 text-xs dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                Verified Shop
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopInfoCard;
