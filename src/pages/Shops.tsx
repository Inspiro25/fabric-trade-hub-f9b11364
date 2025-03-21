
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, CheckCircle, Star, Filter, ShoppingBag } from 'lucide-react';
import { Shop, mockShops, fetchShops } from '@/lib/shops';
import { useIsMobile } from '@/hooks/use-mobile';

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await fetchShops();
        setShops(shopsData);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        setShops(mockShops); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    loadShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Explore Shops</h1>
          <p className="text-sm text-gray-600">Discover and shop from our verified partners</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search shops by name or description..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
              {!isMobile && (
                <Button variant="outline" size="sm" className="absolute right-1 top-1 h-8">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No shops found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search term</p>
            <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
              <Link to={`/shop/${shop.id}`} key={shop.id} className="block transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Card className="overflow-hidden h-full border-none shadow-sm">
                  <div className="relative h-32 bg-gradient-to-r from-purple-100 to-indigo-100">
                    <img 
                      src={shop.coverImage} 
                      alt={shop.name} 
                      className="w-full h-full object-cover mix-blend-overlay" 
                    />
                    {shop.isVerified && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white border-none font-normal flex gap-1 items-center">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="relative p-4">
                    <div className="flex items-start mb-3">
                      <div className="h-14 w-14 rounded-full border-4 border-white bg-white shadow-sm -mt-10 overflow-hidden">
                        <img 
                          src={shop.logo} 
                          alt={shop.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="ml-2 mt-0.5">
                        <h3 className="font-semibold text-gray-800">{shop.name}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                          <span className="text-sm">{shop.rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500 ml-1">({shop.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {shop.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="mt-3 w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                      View Shop
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shops;
