
import { supabase } from '@/lib/supabase';
import { Product, normalizeProduct } from '../types/product';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// Updated filter for product search - now uses proper types
export const useProductSearch = (searchQuery: string, filters: any = {}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['product-search', searchQuery, filters],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        let query = supabase.from('products').select('*');
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        
        if (filters.category) {
          query = query.eq('category_id', filters.category);
        }
        
        const { data, error } = await query
          .range(pageParam * 10, (pageParam * 10) + 9)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data?.map(normalizeProduct) || [];
      } catch (error) {
        console.error('Error searching products:', error);
        return [];
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    }
  });
  
  const products = data?.pages.flat() || [];
  
  return {
    products,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isLoading,
    isFetchingMore: isFetchingNextPage
  };
};

export const fetchProducts = async ({ query = '', category = '' } = {}) => {
  try {
    let queryBuilder = supabase.from('products').select('*');
    
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    
    if (category) {
      queryBuilder = queryBuilder.eq('category_id', category);
    }
    
    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(normalizeProduct) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchRelatedProducts = async (productId: string, categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .neq('id', productId)
      .limit(8);
    
    if (error) throw error;
    return data?.map(normalizeProduct) || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};
