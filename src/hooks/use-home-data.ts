
import { useQuery } from '@tanstack/react-query';
import { 
  getNewArrivals, 
  getTrendingProducts, 
  getAllCategories, 
  getTopRatedProducts, 
  getDiscountedProducts, 
  getBestSellingProducts,
  Product
} from '@/lib/products';

export function useHomeData() {
  // Fetch categories data with React Query
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2, // Retry failed requests up to 2 times
  });

  // Fetch new arrivals data with React Query
  const newArrivalsQuery = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: getNewArrivals,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Fetch trending products data with React Query
  const trendingQuery = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: getTrendingProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Fetch top rated products data with React Query
  const topRatedQuery = useQuery({
    queryKey: ['products', 'topRated'],
    queryFn: getTopRatedProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Fetch discounted products data with React Query
  const discountedQuery = useQuery({
    queryKey: ['products', 'discounted'],
    queryFn: getDiscountedProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Fetch best selling products data with React Query
  const bestSellersQuery = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: getBestSellingProducts,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    retry: 2,
  });

  // Check if any queries have errors
  const hasErrors = 
    categoriesQuery.error || 
    newArrivalsQuery.error || 
    trendingQuery.error || 
    topRatedQuery.error || 
    discountedQuery.error || 
    bestSellersQuery.error;

  // Combine all loading states
  const isLoading = 
    categoriesQuery.isLoading || 
    newArrivalsQuery.isLoading;

  // Create a dataLoaded object to track which data has been loaded
  const dataLoaded = {
    categories: !categoriesQuery.isLoading && !categoriesQuery.error,
    newArrivals: !newArrivalsQuery.isLoading && !newArrivalsQuery.error,
    trending: !trendingQuery.isLoading && !trendingQuery.error,
    bestSellers: !bestSellersQuery.isLoading && !bestSellersQuery.error,
    topRated: !topRatedQuery.isLoading && !topRatedQuery.error,
    discounted: !discountedQuery.isLoading && !discountedQuery.error
  };

  return {
    categories: categoriesQuery.data || [],
    newArrivals: newArrivalsQuery.data || [],
    trendingProducts: trendingQuery.data || [],
    topRatedProducts: topRatedQuery.data || [],
    discountedProducts: discountedQuery.data || [],
    bestSellers: bestSellersQuery.data || [],
    isLoading,
    dataLoaded,
    hasErrors
  };
}
