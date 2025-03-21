import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Search, CheckCircle, Star } from 'lucide-react';
import { Shop, mockShops, fetchShops } from '@/lib/shops';

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="pb-10">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-sm font-medium">Shops</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Input 
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-full shadow-sm"
        />
      </div>
      
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="text-center py-10">Loading shops...</div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-10">No shops found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
              <Link to={`/shop/${shop.id}`} key={shop.id}>
                <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={shop.coverImage} 
                      alt={shop.name} 
                      className="w-full h-40 object-cover" 
                    />
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start mb-2">
                      <Avatar className="mr-3 h-9 w-9">
                        <AvatarImage src={shop.logo} alt={shop.name} />
                        <AvatarFallback>{shop.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <CardTitle className="text-sm font-semibold flex items-center">
                          {shop.name}
                          {shop.isVerified && (
                            <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                          )}
                        </CardTitle>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span>{shop.rating.toFixed(1)} ({shop.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {shop.description}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>
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
