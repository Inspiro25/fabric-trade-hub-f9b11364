
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/products/types';

// Helper function to normalize product data from Supabase
const normalizeProductData = (product: any): Product => {
  return {
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
    shopId: product.shop_id || '',
    tags: product.tags || [],
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
};

export const useProductsData = (options?: {
  limit?: number;
  categoryId?: string;
  isNew?: boolean;
  isTrending?: boolean;
  featured?: boolean;
  withDiscount?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
}) => {
  const [totalCount, setTotalCount] = useState(0);

  const {
    limit = 12,
    categoryId,
    isNew,
    isTrending,
    featured,
    withDiscount,
    sortBy = 'newest',
  } = options || {};

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', { limit, categoryId, isNew, isTrending, featured, withDiscount, sortBy }],
    queryFn: async () => {
      try {
        // Start building the query
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' });

        // Apply filters if provided
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (isNew) {
          query = query.eq('is_new', true);
        }

        if (isTrending) {
          query = query.eq('is_trending', true);
        }

        if (withDiscount) {
          query = query.not('sale_price', 'is', null);
        }

        // Apply ordering
        switch (sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          case 'popularity':
            query = query.order('review_count', { ascending: false });
            break;
        }

        // Apply limit
        query = query.limit(limit);

        // Execute the query
        const { data, error, count } = await query;

        if (error) throw error;
        
        if (count !== null) {
          setTotalCount(count);
        }
        
        return data ? data.map(normalizeProductData) : [];
      } catch (err) {
        console.error('Error fetching products:', err);
        return [];
      }
    }
  });

  return {
    products: products || [],
    isLoading,
    error,
    totalCount
  };
};

export const useCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching categories:', err);
        return [];
      }
    }
  });

  return {
    categories: data || [],
    isLoading,
    error
  };
};

export const useShops = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('shops').select('*');
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching shops:', err);
        return [];
      }
    }
  });

  return {
    shops: data || [],
    isLoading,
    error
  };
};

export const useProductById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data ? normalizeProductData(data) : null;
      } catch (err) {
        console.error(`Error fetching product ${id}:`, err);
        return null;
      }
    },
    enabled: !!id
  });

  return {
    product: data,
    isLoading,
    error
  };
};
