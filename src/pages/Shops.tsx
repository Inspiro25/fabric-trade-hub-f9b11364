
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, CheckCircle, Star, Filter, ShoppingBag } from 'lucide-react';
import { useShopSearch } from '@/hooks/use-shop-search';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchErrorState from '@/components/search/SearchErrorState';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Shops = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    shops: filteredShops, 
    isLoading, 
    error,
    clearSearch 
  } = useShopSearch();
  
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle retry button click
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={cn(
      "min-h-screen pb-6",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
    )}>
      {/* Header section */}
      <div className={cn(
        "border-b",
        isDarkMode 
          ? "bg-gradient-to-r from-gray-800 to-gray-800/50 border-gray-700" 
          : "bg-gradient-to-r from-kutuku-light to-kutuku-light/50"
      )}>
        <div className="container mx-auto px-3 py-[25px]">
          <h1 className={cn(
            "text-xl font-bold mb-1",
            isDarkMode ? "text-white" : "text-kutuku-dark"
          )}>Explore Shops</h1>
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>Discover products from verified partners</p>
        </div>
      </div>
      
      {/* Search section */}
      <div className="container mx-auto px-3 -mt-3">
        <Card className={cn(
          "border-none shadow-sm",
          isDarkMode && "bg-gray-800"
        )}>
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search shops..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className={cn(
                  "pl-8 pr-8 h-9 text-sm rounded-full",
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-200" 
                    : "bg-gray-50"
                )} 
              />
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "absolute right-1 top-1 h-7 text-xs rounded-full",
                    isDarkMode && "border-gray-600 text-gray-200 hover:bg-gray-700"
                  )}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="container mx-auto px-3 mt-4">
          <SearchErrorState error={error} onRetry={handleRetry} />
        </div>
      )}
      
      {/* Main content section */}
      <div className="container mx-auto px-3 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className={cn(
              "animate-spin rounded-full h-8 w-8 border-b-2",
              isDarkMode ? "border-orange-500" : "border-kutuku-primary"
            )}></div>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className={cn(
            "text-center py-8 rounded-lg shadow-sm",
            isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white"
          )}>
            <ShoppingBag className={cn(
              "h-12 w-12 mx-auto mb-3",
              isDarkMode ? "text-gray-600" : "text-gray-300"
            )} />
            <h3 className={cn(
              "text-base font-medium mb-1",
              isDarkMode && "text-gray-200"
            )}>No shops found</h3>
            <p className={cn(
              "text-sm mb-3",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>Try adjusting your search term</p>
            <Button 
              onClick={clearSearch} 
              className={cn(
                "text-sm rounded-full",
                isDarkMode 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "bg-kutuku-primary hover:bg-kutuku-secondary"
              )}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredShops.map(shop => (
              <Link 
                to={`/shop/${shop.id}`} 
                key={shop.id} 
                className="block transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Card className={cn(
                  "overflow-hidden h-full border-none shadow-sm",
                  isDarkMode && "bg-gray-800"
                )}>
                  <div className="relative h-24 bg-gradient-to-r from-kutuku-light to-kutuku-light/50">
                    <img 
                      src={shop.coverImage} 
                      alt={shop.name} 
                      className="w-full h-full object-cover" 
                    />
                    {shop.isVerified && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white border-none text-xs px-1.5 font-normal flex gap-0.5 items-center">
                        <CheckCircle className="h-2.5 w-2.5" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="relative p-3">
                    <div className="flex items-start mb-2">
                      <div className="h-10 w-10 rounded-full border-2 border-white bg-white shadow-sm -mt-8 overflow-hidden">
                        <img 
                          src={shop.logo} 
                          alt={shop.name} 
                          className="w-full h-full object-cover" 
                          onError={e => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }} 
                        />
                      </div>
                      <div className="ml-2 mt-0">
                        <h3 className={cn(
                          "font-medium text-sm",
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        )}>{shop.name}</h3>
                        <div className="flex items-center mt-0.5">
                          <Star className="h-3 w-3 text-yellow-500 mr-0.5" />
                          <span className={cn(
                            "text-xs",
                            isDarkMode && "text-gray-300"
                          )}>{shop.rating.toFixed(1)}</span>
                          <span className={cn(
                            "text-xs ml-1",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>({shop.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-xs mb-2 line-clamp-2 min-h-[2rem]",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      {shop.description}
                    </p>
                    
                    <div className={cn(
                      "flex items-center text-xs",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1 text-xs">{shop.address}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "mt-2 w-full text-xs py-1",
                        isDarkMode 
                          ? "text-orange-400 hover:text-orange-300 hover:bg-gray-700" 
                          : "text-kutuku-primary hover:text-kutuku-primary hover:bg-kutuku-light"
                      )}
                    >
                      View Shop
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {error && (
          <div className={cn(
            "mt-4 p-3 rounded-md text-sm",
            isDarkMode 
              ? "bg-red-900/30 text-red-300 border border-red-800" 
              : "bg-red-50 text-red-600"
          )}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shops;
