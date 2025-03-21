
import React from 'react';
import { Link } from 'react-router-dom';
import { shops } from '@/lib/shops';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CalendarDays, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';

const ShopCard = ({ shop }: { shop: typeof shops[0] }) => {
  const createdDate = new Date(shop.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  return (
    <Link to={`/shop/${shop.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <div className="h-32 overflow-hidden">
          <img 
            src={shop.coverImage} 
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="pt-4 relative">
          <div className="absolute -top-8 left-4 w-16 h-16 rounded-full overflow-hidden border-4 border-white bg-white">
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-20">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold truncate">{shop.name}</h3>
              {shop.isVerified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span>{shop.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{shop.reviewCount} reviews</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {shop.description}
          </p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{shop.address}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 pb-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>Joined {timeAgo}</span>
          </div>
          <Badge className="ml-auto" variant="outline">
            {shop.productIds.length} products
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

const Shops = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Featured Shops</h1>
      
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {shops.map(shop => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
};

export default Shops;
