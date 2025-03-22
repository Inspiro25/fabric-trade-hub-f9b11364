
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrendingProducts } from '@/lib/products/trending';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Flame, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ITEMS_PER_PAGE = 12;

const TrendingNow = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortOption, setSortOption] = useState<'popularity' | 'rating' | 'recent'>('popularity');
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const isMobile = useIsMobile();

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
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold">Trending Now</h1>
        </div>
        
        <div className="mb-6 text-sm text-gray-600">
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
                className={`mr-2 whitespace-nowrap ${
                  selectedFilter === filter.value 
                    ? "bg-orange-500 hover:bg-orange-600" 
                    : "bg-white"
                }`}
                onClick={() => setSelectedFilter(filter.value as any)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <select
              className="border rounded-md px-3 py-1 text-sm bg-white"
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
              <div key={index} className="bg-white p-2 rounded-lg">
                <Skeleton className="h-40 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load trending products</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
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
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice}
                    image={product.images[0]}
                    category={product.category}
                    isNew={product.isNew || false}
                    isTrending={true}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                </div>
              ))}
            </div>
            
            {visibleItems < (trendingProducts?.length || 0) && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  className="border-orange-300 text-orange-700"
                >
                  Load More <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No trending products found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrendingNow;
