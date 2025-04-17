import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, CheckCircle, Star, Filter, ShoppingBag, Users, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import { useShopSearch } from '@/hooks/use-shop-search';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchErrorState from '@/components/search/SearchErrorState';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [sortBy, setSortBy] = useState<'rating' | 'followers' | 'reviews'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle retry button click
  const handleRetry = () => {
    window.location.reload();
  };

  // Sort and filter shops
  const sortedAndFilteredShops = React.useMemo(() => {
    let shops = [...filteredShops];
    
    // Apply verified filter
    if (showVerifiedOnly) {
      shops = shops.filter(shop => shop.isVerified);
    }
    
    // Apply sorting
    shops.sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      switch (sortBy) {
        case 'rating':
          return multiplier * ((a.rating || 0) - (b.rating || 0));
        case 'followers':
          return multiplier * ((a.followers || 0) - (b.followers || 0));
        case 'reviews':
          return multiplier * ((a.reviewCount || 0) - (b.reviewCount || 0));
        default:
          return 0;
      }
    });
    
    return shops;
  }, [filteredShops, sortBy, sortOrder, showVerifiedOnly]);

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
    )}>
      {/* Header section */}
      <div className={cn(
        "border-b",
        isDarkMode 
          ? "bg-gray-900/80 border-gray-800" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Explore Shops</h1>
              <p className={cn(
                "text-sm mt-1",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>Discover products from verified partners</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-9 w-9",
                  viewMode === 'grid' && (isDarkMode ? "text-orange-400" : "text-orange-500")
                )}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-9 w-9",
                  viewMode === 'list' && (isDarkMode ? "text-orange-400" : "text-orange-500")
                )}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Combined search and filters section */}
          <div className="relative max-w-4xl mx-auto">
            <div className={cn(
              "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg",
              isDarkMode 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-gray-50 border border-gray-200"
            )}>
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search shops..." 
                  value={searchTerm} 
                  onChange={handleSearchChange} 
                  className={cn(
                    "pl-10 h-10 text-sm border-0 focus-visible:ring-0 bg-transparent w-full",
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  )} 
                />
              </div>
              
              <div className="hidden sm:block h-10 w-px bg-gray-300 dark:bg-gray-600" />
              
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: 'rating' | 'followers' | 'reviews') => setSortBy(value)}>
                  <SelectTrigger className={cn(
                    "h-10 w-[120px] text-sm border-0 focus:ring-0 bg-transparent",
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  )}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className={cn(
                    "h-10 w-10 p-0 border-0",
                    isDarkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-200"
                  )}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
                
                <div className="hidden sm:block h-10 w-px bg-gray-300 dark:bg-gray-600" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVerifiedOnly(prev => !prev)}
                  className={cn(
                    "h-10 text-sm border-0 whitespace-nowrap",
                    showVerifiedOnly 
                      ? isDarkMode 
                        ? "text-orange-400 hover:text-orange-300" 
                        : "text-orange-500 hover:text-orange-600"
                      : isDarkMode 
                        ? "text-gray-200 hover:bg-gray-700" 
                        : "text-gray-900 hover:bg-gray-200"
                  )}
                >
                  <CheckCircle className={cn(
                    "h-4 w-4 mr-1.5",
                    showVerifiedOnly && "text-orange-500"
                  )} />
                  Verified
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <SearchErrorState error={error} onRetry={handleRetry} />
        </div>
      )}
      
      {/* Main content section */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className={cn(
              "animate-spin rounded-full h-8 w-8 border-b-2",
              isDarkMode ? "border-orange-500" : "border-orange-500"
            )}></div>
          </div>
        ) : sortedAndFilteredShops.length === 0 ? (
          <div className={cn(
            "text-center py-12 rounded-xl shadow-sm",
            isDarkMode ? "bg-gray-800/50 text-gray-200" : "bg-white"
          )}>
            <ShoppingBag className={cn(
              "h-16 w-16 mx-auto mb-4",
              isDarkMode ? "text-gray-600" : "text-gray-300"
            )} />
            <h3 className={cn(
              "text-lg font-medium mb-2",
              isDarkMode && "text-gray-200"
            )}>No shops found</h3>
            <p className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>Try adjusting your search term or filters</p>
            <Button 
              onClick={clearSearch} 
              className={cn(
                "text-sm rounded-lg",
                isDarkMode 
                  ? "bg-orange-600 hover:bg-orange-700" 
                  : "bg-orange-500 hover:bg-orange-600"
              )}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "flex flex-col"
          )}>
            {sortedAndFilteredShops.map(shop => (
              <Link 
                to={`/shops/${shop.id}`} 
                key={shop.id} 
                className={cn(
                  "block transform transition-all duration-300 hover:-translate-y-1",
                  viewMode === 'grid' ? "hover:shadow-lg" : "hover:shadow-md"
                )}
              >
                <Card className={cn(
                  "overflow-hidden h-full border-none",
                  isDarkMode ? "bg-gray-800/50" : "bg-white",
                  viewMode === 'list' && "flex"
                )}>
                  <div className={cn(
                    "relative",
                    viewMode === 'grid' ? "h-40" : "h-32 w-32 flex-shrink-0"
                  )}>
                    <img 
                      src={shop.coverImage} 
                      alt={shop.name} 
                      className="w-full h-full object-cover" 
                    />
                    {shop.isVerified && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white border-none text-xs px-2 py-0.5 font-normal flex gap-1 items-center">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className={cn(
                    "p-4",
                    viewMode === 'list' && "flex-1"
                  )}>
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "rounded-full border-2 border-white bg-white shadow-sm overflow-hidden",
                        viewMode === 'grid' ? "h-12 w-12 -mt-12" : "h-10 w-10"
                      )}>
                        <img 
                          src={shop.logo} 
                          alt={shop.name} 
                          className="w-full h-full object-cover" 
                          onError={e => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-medium text-base truncate",
                          isDarkMode ? "text-gray-200" : "text-gray-900"
                        )}>{shop.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 text-yellow-500 mr-0.5" />
                            <span className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>{shop.rating.toFixed(1)}</span>
                            <span className={cn(
                              "text-sm ml-1",
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            )}>({shop.reviewCount})</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 text-purple-500 mr-0.5" />
                            <span className={cn(
                              "text-sm",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>{shop.followers || shop.followers_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm mt-3 line-clamp-2",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      {shop.description}
                    </p>
                    
                    <div className={cn(
                      "flex items-center text-sm mt-3",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      <MapPin className="h-4 w-4 mr-1.5" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "mt-4 w-full text-sm",
                        isDarkMode 
                          ? "text-orange-400 hover:text-orange-300 hover:bg-gray-700" 
                          : "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
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
      </div>
    </div>
  );
};

export default Shops;
