
import { useQuery } from '@tanstack/react-query';
import { 
  useNewArrivals, 
  useTrendingProducts, 
  useTopRatedProducts, 
  useDiscountedProducts,
  fetchNewArrivals,
  fetchTrendingProducts,
  fetchTopRatedProducts,
  fetchDiscountedProducts
} from '@/hooks/use-product-fetching';
import { Product } from '@/lib/types/product';

// Re-export the hooks for use in components
export { 
  useNewArrivals, 
  useTrendingProducts, 
  useTopRatedProducts, 
  useDiscountedProducts 
};

// Fetch all home page data in a single hook
export const useHomeData = (limit = 8) => {
  const newArrivalsQuery = useQuery({
    queryKey: ['newArrivals', limit],
    queryFn: () => fetchNewArrivals(limit),
  });

  const trendingProductsQuery = useQuery({
    queryKey: ['trendingProducts', limit],
    queryFn: () => fetchTrendingProducts(limit),
  });

  const topRatedProductsQuery = useQuery({
    queryKey: ['topRatedProducts', limit],
    queryFn: () => fetchTopRatedProducts(limit),
  });

  const discountedProductsQuery = useQuery({
    queryKey: ['discountedProducts', limit],
    queryFn: () => fetchDiscountedProducts(limit),
  });

  return {
    newArrivals: {
      data: newArrivalsQuery.data || [] as Product[],
      isLoading: newArrivalsQuery.isLoading,
      error: newArrivalsQuery.error
    },
    trendingProducts: {
      data: trendingProductsQuery.data || [] as Product[],
      isLoading: trendingProductsQuery.isLoading,
      error: trendingProductsQuery.error
    },
    topRatedProducts: {
      data: topRatedProductsQuery.data || [] as Product[],
      isLoading: topRatedProductsQuery.isLoading,
      error: topRatedProductsQuery.error
    },
    discountedProducts: {
      data: discountedProductsQuery.data || [] as Product[],
      isLoading: discountedProductsQuery.isLoading,
      error: discountedProductsQuery.error
    },
    isLoading: 
      newArrivalsQuery.isLoading || 
      trendingProductsQuery.isLoading || 
      topRatedProductsQuery.isLoading || 
      discountedProductsQuery.isLoading,
    isError: 
      !!newArrivalsQuery.error || 
      !!trendingProductsQuery.error || 
      !!topRatedProductsQuery.error || 
      !!discountedProductsQuery.error
  };
};

export default useHomeData;
