
import { useQuery } from '@tanstack/react-query';
import { Product, adaptProduct } from '@/lib/products/types';
import { mockProducts } from '@/lib/products/mockData';

// Simulated API function to fetch best sellers
const fetchBestSellers = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  // For now, just filter the mock products with highest ratings
  const sortedProducts = [...mockProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
    
  return sortedProducts.map(product => adaptProduct(product));
};

export const useBestSellers = (limit = 8) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bestSellers', limit],
    queryFn: () => fetchBestSellers(),
  });

  return {
    bestSellers: data || [],
    isLoading,
    error
  };
};
