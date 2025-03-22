
import { useQuery } from '@tanstack/react-query';
import { 
  getNewArrivals, 
  getTrendingProducts, 
  getAllCategories, 
  getTopRatedProducts, 
  getDiscountedProducts, 
  getBestSellingProducts,
} from '@/lib/products';

export function useHomeData() {
  // Optimize stale time and caching for better performance
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 1,
  });

  const newArrivalsQuery = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: getNewArrivals,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 1,
  });

  const trendingQuery = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: getTrendingProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const topRatedQuery = useQuery({
    queryKey: ['products', 'topRated'],
    queryFn: getTopRatedProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !categoriesQuery.isLoading && !newArrivalsQuery.isLoading, // Load after initial content
  });

  const discountedQuery = useQuery({
    queryKey: ['products', 'discounted'],
    queryFn: getDiscountedProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !categoriesQuery.isLoading && !newArrivalsQuery.isLoading, // Load after initial content
  });

  const bestSellersQuery = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: getBestSellingProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !categoriesQuery.isLoading && !newArrivalsQuery.isLoading, // Load after initial content
  });

  // Only consider initial data loading states
  const isInitialLoading = categoriesQuery.isLoading || newArrivalsQuery.isLoading;
  
  // Track which data has been loaded
  const dataLoaded = {
    categories: !categoriesQuery.isLoading && !categoriesQuery.error,
    newArrivals: !newArrivalsQuery.isLoading && !newArrivalsQuery.error,
    trending: !trendingQuery.isLoading && !trendingQuery.error,
    bestSellers: !bestSellersQuery.isLoading && !bestSellersQuery.error,
    topRated: !topRatedQuery.isLoading && !topRatedQuery.error,
    discounted: !discountedQuery.isLoading && !discountedQuery.error
  };

  // Return only the data we need
  return {
    categories: categoriesQuery.data || [],
    newArrivals: newArrivalsQuery.data || [],
    trendingProducts: trendingQuery.data || [],
    topRatedProducts: topRatedQuery.data || [],
    discountedProducts: discountedQuery.data || [],
    bestSellers: bestSellersQuery.data || [],
    isLoading: isInitialLoading,
    dataLoaded,
    hasErrors: categoriesQuery.error || newArrivalsQuery.error
  };
}
