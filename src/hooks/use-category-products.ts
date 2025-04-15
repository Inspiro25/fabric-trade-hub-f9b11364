
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/lib/products/filters';

export function useCategoryProducts(categoryId: string, limit = 12) {
  return useQuery({
    queryKey: ['category-products', categoryId, limit],
    queryFn: () => getProductsByCategory(categoryId, limit),
    enabled: !!categoryId,
  });
}
