
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mockProducts } from '@/lib/types/product';

export function useHomePageData() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').limit(8);
        if (error) throw error;
        return data || mockProducts.slice(0, 8);
      } catch (error) {
        console.error('Error fetching products:', error);
        return mockProducts.slice(0, 8);
      }
    }
  });

  return { products: products || [], isLoading };
}

export function useInfiniteProducts() {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useInfiniteQuery({
    queryKey: ['infinite-products'],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .range(pageParam * 10, (pageParam * 10) + 9);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
    initialPageParam: 0,  // Add this to fix the TanStack query error
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    }
  });

  const products = data?.pages.flat() || [];
  const loadMore = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    products,
    loadMore,
    hasMore: hasNextPage,
    isLoading,
    isFetchingNextPage
  };
}

export function useCategories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });

  return { categories: categories || [], isLoading };
}
