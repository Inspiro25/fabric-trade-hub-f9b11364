
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, adaptProduct } from '@/lib/types/product';
import { Shop, adaptShopData } from '@/lib/shops/types';

export const useProductFetching = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw new Error(`Error fetching product: ${error.message}`);
      }

      if (!data) {
        throw new Error('Product not found');
      }

      // Use the adaptProduct function to standardize the product format
      setProduct(adaptProduct(data));
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refreshProduct = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refreshProduct };
};

// Export utility functions for fetching products
export const fetchProducts = async (limit = 12, offset = 0): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};

export const fetchRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    // First get the current product to find its category
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('category_id, tags')
      .eq('id', productId)
      .single();

    if (productError || !productData) {
      return [];
    }

    // Find products with the same category or tags, excluding current product
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', productId)
      .eq('category_id', productData.category_id)
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchRelatedProducts:', error);
    return [];
  }
};

export const fetchNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchNewArrivals:', error);
    return [];
  }
};

export const fetchTrendingProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchTrendingProducts:', error);
    return [];
  }
};

export const fetchTopRatedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top rated products:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchTopRatedProducts:', error);
    return [];
  }
};

export const fetchDiscountedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('sale_price', 'is', null)
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching discounted products:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchDiscountedProducts:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId: string, limit = 12, offset = 0): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchProductsByCategory:', error);
    return [];
  }
};

export const fetchProductsByShop = async (shopId: string, limit = 12, offset = 0): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }

    return data ? data.map(product => adaptProduct(product)) : [];
  } catch (error) {
    console.error('Error in fetchProductsByShop:', error);
    return [];
  }
};

// React Query hooks for the product fetching functions
export const useNewArrivals = (limit = 8) => {
  return useQuery({
    queryKey: ['newArrivals', limit],
    queryFn: () => fetchNewArrivals(limit),
  });
};

export const useTrendingProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['trendingProducts', limit],
    queryFn: () => fetchTrendingProducts(limit),
  });
};

export const useTopRatedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['topRatedProducts', limit],
    queryFn: () => fetchTopRatedProducts(limit),
  });
};

export const useDiscountedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['discountedProducts', limit],
    queryFn: () => fetchDiscountedProducts(limit),
  });
};

export const useProductsByCategory = (categoryId: string, limit = 12, offset = 0) => {
  return useQuery({
    queryKey: ['productsByCategory', categoryId, limit, offset],
    queryFn: () => fetchProductsByCategory(categoryId, limit, offset),
    enabled: !!categoryId,
  });
};

export default useProductFetching;
