
import { useQuery } from '@tanstack/react-query';
import { getFilteredProducts } from '@/lib/products/filters';
import { ProductQueryType } from '@/lib/products/types';

export function useFilteredProducts(type: ProductQueryType, limit = 8) {
  return useQuery({
    queryKey: ['products', type, limit],
    queryFn: () => getFilteredProducts(type, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error(`Error fetching ${type} products:`, error);
      }
    }
  });
}
