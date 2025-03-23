import { useQuery } from '@tanstack/react-query';
import { 
  useNewArrivals, 
  useTrendingProducts, 
  useTopRatedProducts,
  useDiscountedProducts,
} from '@/hooks/use-product-fetching';
import { getAllCategories } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

export function useHomeData() {
  // Optimize stale time and caching for better performance
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 1,
  });

  // Use the new hooks for fetching different product types
  const newArrivalsQuery = useNewArrivals(8);
  const trendingQuery = useTrendingProducts(8);
  const topRatedQuery = useTopRatedProducts(8);
  const discountedQuery = useDiscountedProducts(8);

  // Additional query for best sellers (based on review count as a proxy)
  const bestSellersQuery = useQuery({
    queryKey: ['products', 'bestSellers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('review_count', { ascending: false })
          .limit(8);
        
        if (error) throw error;
        
        return data ? data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category_id || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          isNew: product.is_new || false,
          isTrending: product.is_trending || false,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0,
          tags: product.tags || [],
          shopId: product.shop_id || '',
        })) : [];
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !categoriesQuery.isLoading && !newArrivalsQuery.isLoading,
  });

  // Only consider initial data loading states
  const isLoading = categoriesQuery.isLoading || newArrivalsQuery.isLoading;
  
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
    isLoading,
    dataLoaded,
    hasErrors: categoriesQuery.error || newArrivalsQuery.error
  };
}
