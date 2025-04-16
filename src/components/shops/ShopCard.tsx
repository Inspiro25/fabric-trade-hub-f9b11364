
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useShopProducts } from '@/hooks/use-shop-products';

interface ShopCardProps {
  shop: any;
  className?: string;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, className }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { products, isLoading } = useShopProducts(shop.id);
  
  useEffect(() => {
    console.log(`Shop ${shop.name} (${shop.id}) has ${products.length} products:`, products);
  }, [shop.id, shop.name, products]);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden h-full flex flex-col border transition-all",
        isDarkMode ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white hover:border-gray-300",
        className
      )}
      onClick={() => navigate(`/shops/${shop.id}`)}
    >
      {/* Cover image */}
      <div className="relative h-36 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {shop.cover_image ? (
          <img 
            src={shop.cover_image} 
            alt={`${shop.name} cover`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        
        {/* Logo */}
        <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 bg-white dark:bg-gray-800 border-white dark:border-gray-900 overflow-hidden shadow-md">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={shop.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
                {shop.name?.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        {/* Verification badge if shop is verified */}
        {shop.is_verified && (
          <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">Verified</Badge>
        )}
      </div>
      
      <CardContent className="mt-8 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "font-bold truncate",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {shop.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{shop.rating || '0'}</span>
            <span className="text-xs text-gray-500">({shop.review_count || '0'})</span>
          </div>
        </div>
        
        {shop.address && (
          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{shop.address}</span>
          </div>
        )}
        
        <p className={cn(
          "mt-3 text-sm line-clamp-2",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          {shop.description || 'No description available'}
        </p>
        
        {/* Products count */}
        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <ShoppingBag className="w-3 h-3 mr-1" />
          {isLoading ? (
            <span>Loading products...</span>
          ) : (
            <span>{products.length} products</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className={cn(
        "pt-0 pb-4",
        isDarkMode ? "border-t-gray-800" : "border-t-gray-100"
      )}>
        <Button 
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/shops/${shop.id}`);
          }}
        >
          Visit Shop
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopCard;
