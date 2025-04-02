import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, normalizeProductData } from '@/lib/products/types';
import { firebaseUIDToUUID } from '@/utils/format';

interface UseProductFetchingProps {
  category?: string;
  limit?: number;
  page?: number;
}

// Define the base query with all necessary fields that exist in the database
const baseProductQuery = `
  id,
  name,
  description,
  price,
  sale_price,
  rating,
  review_count,
  created_at,
  category_id,
  shop_id,
  stock,
  images,
  colors,
  sizes,
  is_new,
  is_trending,
  tags
`;

export const useProductFetching = ({ category, limit = 10, page = 1 }: UseProductFetchingProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select(baseProductQuery, { count: 'exact' });

        if (category) {
          query = query.eq('category_id', category);
        }

        const { data, error, count } = await query
          .range((page - 1) * limit, page * limit - 1)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert to Product[] type safely using our normalizeProductData function
        if (data) {
          const normalizedProducts = data.map(item => normalizeProductData(item));
          setProducts(normalizedProducts);
        } else {
          setProducts([]);
        }
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit, page]);

  return { products, loading, error, totalCount };
};

export const useNewArrivals = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(baseProductQuery)
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        
        // Convert to Product[] type safely using our normalizeProductData function
        if (data) {
          const normalizedProducts = data.map(item => normalizeProductData(item));
          setProducts(normalizedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch new arrivals');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [limit]);

  return { products, loading, error };
};

export const useDiscountedProducts = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(baseProductQuery)
          .not('sale_price', 'is', null)
          .gt('sale_price', 0)
          .order('sale_price', { ascending: true })
          .limit(limit);

        if (error) throw error;
        
        // Convert to Product[] type safely using our normalizeProductData function
        if (data) {
          const normalizedProducts = data.map(item => normalizeProductData(item));
          setProducts(normalizedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching discounted products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch discounted products');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useTopRatedProducts = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(baseProductQuery)
          .order('rating', { ascending: false })
          .gt('rating', 4)
          .limit(limit);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching top rated products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch top rated products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useTrendingProducts = (limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(baseProductQuery)
          .order('views', { ascending: false })
          .gt('views', 100)
          .limit(limit);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching trending products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch trending products');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [limit]);

  return { products, loading, error };
};

export const useProductsByCategory = (categoryId: string, limit = 10, page = 1) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const { data, error, count } = await supabase
          .from('products')
          .select(baseProductQuery, { count: 'exact' })
          .eq('category_id', categoryId)
          .range((page - 1) * limit, page * limit - 1)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const normalizedProducts = data.map(item => normalizeProductData(item));
          setProducts(normalizedProducts);
        } else {
          setProducts([]);
        }
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching products by category:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products by category');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId, limit, page]);

  return { products, loading, error, totalCount };
};

const fetchUserData = async (userId: string) => {
  try {
    const supabaseUUID = firebaseUIDToUUID(userId);
    
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('product_id')
      .eq('user_id', supabaseUUID);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
