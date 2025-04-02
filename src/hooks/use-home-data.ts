import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useHomeData() {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const productsInfiniteQuery = useInfiniteQuery({
    queryKey: ['products-infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);
      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    }
  });

  const newArrivalsQuery = useQuery({
    queryKey: ['newArrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .limit(10);
      if (error) throw error;
      return data || [];
    }
  });

  const bestSellersQuery = useQuery({
    queryKey: ['bestSellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          sale_price,
          images,
          category_id,
          colors,
          sizes,
          is_new,
          is_trending,
          rating,
          review_count,
          stock,
          tags,
          shop_id
        `)
        .limit(10);
      
      if (error) throw error;
      
      // Transform the data to match expected format
      return (data || []).map(product => ({
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
        shopId: product.shop_id || ''
      }));
    }
  });

  const topRatedQuery = useQuery({
    queryKey: ['topRatedProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  const discountedQuery = useQuery({
    queryKey: ['discounted'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .not('sale_price', 'is', null)
        .order('sale_price', { ascending: true })
        .limit(10);
      if (error) throw error;
      return data || [];
    }
  });

  return {
    categoriesQuery,
    productsInfiniteQuery,
    newArrivalsQuery,
    bestSellersQuery,
    topRatedQuery,
    discountedQuery,
    dataLoaded: {
      categories: !categoriesQuery.isLoading && !categoriesQuery.error,
      newArrivals: !newArrivalsQuery.isLoading && !newArrivalsQuery.error,
      bestSellers: !bestSellersQuery.isLoading && !bestSellersQuery.error,
      topRated: !topRatedQuery.isLoading && !topRatedQuery.error,
      discounted: !discountedQuery.isLoading && !discountedQuery.error
    }
  };
}
