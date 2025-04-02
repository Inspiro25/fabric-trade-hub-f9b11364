
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { normalizeProduct, Product } from '@/lib/types/product';

// Sample products for fallback
export const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `This is a sample product ${i + 1}`,
  price: 19.99 + i * 10,
  salePrice: i % 3 === 0 ? 14.99 + i * 8 : null,
  images: [`https://placehold.co/600x400?text=Product+${i + 1}`],
  category: 'category-' + Math.floor(i / 2 + 1),
  colors: ['red', 'blue', 'black'],
  sizes: ['S', 'M', 'L'],
  isNew: i < 4,
  isTrending: i >= 4 && i < 8,
  rating: 3.5 + (i % 3) * 0.5,
  reviewCount: 10 + i * 5,
  stock: 50 - i,
  tags: ['trending', 'new arrival'],
  shopId: `shop-${Math.floor(i / 4) + 1}`,
  brand: `Brand ${Math.floor(i / 3) + 1}`,
  shopName: `Shop ${Math.floor(i / 4) + 1}`,
  categoryId: `category-${Math.floor(i / 2) + 1}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export function useHomePageData() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').limit(8);
        if (error) throw error;
        return data?.map(normalizeProduct) || mockProducts.slice(0, 8);
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
        return data?.map(normalizeProduct) || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
    initialPageParam: 0,
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
