import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingProducts } from '@/lib/products/trending';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Flame, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

const TrendingNow = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortOption, setSortOption] = useState<'popularity' | 'rating' | 'recent'>('popularity');
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  const { data: trendingProducts, isLoading, error } = useQuery({
    queryKey: ['products', 'trending', selectedFilter, sortOption],
    queryFn: () => getTrendingProducts(selectedFilter, sortOption),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loadMore = () => {
    setVisibleItems(prev => prev + ITEMS_PER_PAGE);
  };

  // Filter buttons for time period
  const filterButtons = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'recent', label: 'Recently Added' },
  ];

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-slate-50"
    )}>      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-blue-500" />
          <h1 className={cn(
            "text-xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Trending Now</h1>
        </div>
        
        <div className={cn(
          "mb-6 text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Discover what's popular right now based on views, ratings, and purchases
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex overflow-x-auto pb-2 no-scrollbar">
            {filterButtons.map(filter => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "mr-2 whitespace-nowrap",
                  selectedFilter === filter.value 
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : isDarkMode 
                      ? "bg-gray-800 border-gray-700 text-gray-300" 
                      : "bg-white"
                )}
                onClick={() => setSelectedFilter(filter.value as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <TrendingUp className={cn(
              "h-4 w-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )} />
            <select
              className={cn(
                "border rounded-md px-3 py-1 text-sm",
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 text-gray-300" 
                  : "bg-white"
              )}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className={cn(
                "p-2 rounded-lg",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <Skeleton className={cn(
                  "h-40 w-full rounded-md mb-2",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )} />
                <Skeleton className={cn(
                  "h-4 w-3/4 mb-2",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )} />
                <Skeleton className={cn(
                  "h-4 w-1/2",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className={cn(
              "text-red-500",
              isDarkMode ? "text-red-400" : "text-red-500"
            )}>Failed to load trending products</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className={cn(
                "mt-4",
                isDarkMode ? "border-gray-700 text-gray-300" : ""
              )}
            >
              Try Again
            </Button>
          </div>
        ) : trendingProducts && trendingProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingProducts.slice(0, visibleItems).map(product => (
                <div 
                  key={product.id} 
                  className="transform transition hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            {visibleItems < (trendingProducts?.length || 0) && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  className={cn(
                    isDarkMode
                      ? "border-blue-800 text-blue-400 hover:bg-blue-950/50"
                      : "border-blue-300 text-blue-700"
                  )}
                >
                  Load More <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className={cn(
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>No trending products found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrendingNow;
