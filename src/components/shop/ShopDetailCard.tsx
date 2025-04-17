
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Star, CheckCircle, Calendar, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Shop } from '@/lib/shops';

interface ShopDetailCardProps {
  shop: Shop;
  followersCount: number;
  productsCount: number;
}

const ShopDetailCard: React.FC<ShopDetailCardProps> = ({ 
  shop, 
  followersCount,
  productsCount 
}) => {
  const { isDarkMode } = useTheme();
  const createdDate = new Date(shop.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Card className={`overflow-hidden border-none shadow-md ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'}`}>
      <div className="h-28 relative">
        <img 
          src={shop.coverImage} 
          alt={shop.name}
          className={`w-full h-full object-cover ${isDarkMode ? 'opacity-70' : 'opacity-80'}`}
        />
      </div>
      
      <CardContent className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center">
          <div className={`h-12 w-12 rounded-full overflow-hidden border-2 ${isDarkMode ? 'border-gray-700' : 'border-white'} bg-white shadow-sm flex-shrink-0`}>
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="ml-3">
            <div className="flex items-center">
              <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : ''}`}>{shop.name}</h2>
              {shop.isVerified && (
                <CheckCircle className="h-3 w-3 text-green-500 ml-1.5" />
              )}
            </div>
            
            <div className={`flex items-center mt-0.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Star className="h-2.5 w-2.5 text-yellow-500 mr-1" />
              <span>{shop.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{shop.reviewCount} reviews</span>
              <span className="mx-1">•</span>
              <Users className={`h-2.5 w-2.5 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'} mr-1`} />
              <span>{followersCount} followers</span>
            </div>
            
            <div className={`flex items-center mt-0.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className="h-2.5 w-2.5 mr-1" />
              <span className="truncate">{shop.address}</span>
            </div>
          </div>
        </div>
        
        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300 border-t border-gray-700' : 'text-gray-600 border-t border-gray-100'} pt-2`}>
          <p className="line-clamp-2">{shop.description}</p>
          
          <div className="flex items-center justify-between mt-2 pt-1">
            <span className={`text-[10px] flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Calendar className="h-2.5 w-2.5 mr-1" />
              Joined {timeAgo}
            </span>
            <span className={`text-[10px] flex items-center ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}>
              <ShoppingBag className="h-2.5 w-2.5 mr-1" />
              {productsCount} products
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopDetailCard;
