import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Star, CheckCircle, Calendar, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Shop } from '@/lib/shops';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const createdDate = new Date(shop.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <Card className={`overflow-hidden border-none shadow-md ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'}`}>
      <div className={cn(
        "relative",
        isMobile ? "h-24" : "h-28"
      )}>
        <img 
          src={shop.coverImage} 
          alt={shop.name}
          className={`w-full h-full object-cover ${isDarkMode ? 'opacity-70' : 'opacity-80'}`}
        />
      </div>
      
      <CardContent className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center">
          <div className={cn(
            "rounded-full overflow-hidden border-2 bg-white shadow-sm flex-shrink-0",
            isMobile ? "h-10 w-10" : "h-12 w-12",
            isDarkMode ? "border-gray-700" : "border-white"
          )}>
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className={cn("ml-3", isMobile ? "ml-2" : "ml-3")}>
            <div className="flex items-center">
              <h2 className={cn(
                "font-semibold",
                isMobile ? "text-xs" : "text-sm",
                isDarkMode ? "text-white" : ""
              )}>{shop.name}</h2>
              {shop.isVerified && (
                <CheckCircle className={cn(
                  "text-green-500 ml-1.5",
                  isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
              )}
            </div>
            
            <div className={cn(
              "flex items-center mt-0.5",
              isMobile ? "text-[10px]" : "text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <Star className={cn(
                "text-yellow-500 mr-1",
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5"
              )} />
              <span>{shop.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{shop.reviewCount} reviews</span>
              <span className="mx-1">•</span>
              <Users className={cn(
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5",
                isDarkMode ? "text-orange-400" : "text-orange-500",
                "mr-1"
              )} />
              <span>{followersCount} followers</span>
            </div>
            
            <div className={cn(
              "flex items-center mt-0.5",
              isMobile ? "text-[10px]" : "text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <MapPin className={cn(
                "mr-1",
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5"
              )} />
              <span className="truncate">{shop.address}</span>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "mt-2",
          isMobile ? "text-[10px]" : "text-xs",
          isDarkMode ? "text-gray-300 border-t border-gray-700" : "text-gray-600 border-t border-gray-100",
          "pt-2"
        )}>
          <p className="line-clamp-2">{shop.description}</p>
          
          <div className="flex items-center justify-between mt-2 pt-1">
            <span className={cn(
              "flex items-center",
              isMobile ? "text-[9px]" : "text-[10px]",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <Calendar className={cn(
                "mr-1",
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5"
              )} />
              Joined {timeAgo}
            </span>
            <span className={cn(
              "flex items-center font-medium",
              isMobile ? "text-[9px]" : "text-[10px]",
              isDarkMode ? "text-orange-400" : "text-orange-600"
            )}>
              <ShoppingBag className={cn(
                "mr-1",
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5"
              )} />
              {productsCount} products
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopDetailCard;
