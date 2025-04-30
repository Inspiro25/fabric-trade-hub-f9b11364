
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';
import { firebaseUIDToUUID } from '@/utils/format';

interface UseProductFetchingProps {
  category?: string;
  limit?: number;
  page?: number;
}

// Define the base query with all necessary fields
const baseProductQuery = `
  id,
  name,
  description,
  price,
  discount_price,
  rating,
  views,
  created_at,
  category_id,
  images,
  stock,
  colors,
  sizes,
  tags,
  review_count,
  categories:categories!category_id (
    id,
    name,
    description
  )
`;

// Helper function to transform database product to client Product type
const transformProduct = (item: any): Product => {
  return {
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    salePrice: item.discount_price || item.sale_price,
    sale_price: item.discount_price || item.sale_price,
    images: item.images || [],
    category: item.categories ? item.categories.name || '' : '',
    category_id: item.category_id,
    rating: item.rating || 0,
    reviewCount: item.review_count || 0,
    review_count: item.review_count || 0,
    stock: item.stock || 0,
    colors: item.colors || [],
    sizes: item.sizes || [],
    tags: item.tags || [],
    isNew: item.is_new,
    isTrending: item.is_trending,
    shop_id: item.shop_id
  };
};

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

        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];

        setProducts(mappedProducts);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
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
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        
        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
        
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch new arrivals');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [limit]);

  return { products, loading, error };
};

// Apply the same pattern to all other functions in this file
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
          .not('discount_price', 'is', null)
          .gt('discount_price', 0)
          .order('discount_price', { ascending: true })
          .limit(limit);

        if (error) throw error;
        
        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
        
        setProducts(mappedProducts);
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
        
        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
        
        setProducts(mappedProducts);
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
        
        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
        
        setProducts(mappedProducts);
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
        
        const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
        
        setProducts(mappedProducts);
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

// Export utility functions for compatibility with consistent naming
export const fetchNewArrivals = async (limit = 10): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return data?.map(item => transformProduct(item)) || [];
  } catch (error) {
    console.error('Error in fetchNewArrivals:', error);
    return [];
  }
};

export const fetchTrendingProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .order('views', { ascending: false })
      .gt('views', 100)
      .limit(limit);

    if (error) throw error;
    
    return data?.map(item => transformProduct(item)) || [];
  } catch (error) {
    console.error('Error in fetchTrendingProducts:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId: string, limit = 10): Promise<{products: Product[]}> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('category_id', categoryId)
      .limit(limit);

    if (error) throw error;
    
    const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
    
    return { products: mappedProducts };
  } catch (error) {
    console.error(`Error fetching products by category ${categoryId}:`, error);
    return { products: [] };
  }
};

export const fetchRelatedProducts = async (productId: string, category: string, limit = 4): Promise<Product[]> => {
  try {
    const { products } = await fetchProductsByCategory(category, limit + 1);
    return products.filter(p => p.id !== productId).slice(0, limit);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

export const fetchProducts = async (options: any = {}): Promise<{products: Product[]}> => {
  try {
    let query = supabase
      .from('products')
      .select(baseProductQuery);
    
    // Apply filters based on options
    if (options.minRating) {
      query = query.gte('rating', options.minRating);
    }
    
    if (options.hasDiscount) {
      query = query.not('discount_price', 'is', null);
      query = query.gt('discount_price', 0);
    }
    
    if (options.tags && options.tags.length) {
      query = query.contains('tags', options.tags);
    }
    
    if (options.sortBy) {
      const sortField = options.sortBy === 'popularity' ? 'views' : 
                       options.sortBy === 'rating' ? 'rating' : 'created_at';
      query = query.order(sortField, { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const mappedProducts: Product[] = data?.map(item => transformProduct(item)) || [];
    
    return { products: mappedProducts };
  } catch (error) {
    console.error('Error fetching products with options:', error);
    return { products: [] };
  }
};

export const fetchProductsByShop = async (shopId: string, limit = 10): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(baseProductQuery)
      .eq('shop_id', shopId)
      .limit(limit);

    if (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }
    
    return data.map(item => transformProduct(item));
  } catch (error) {
    console.error('Error in fetchProductsByShop:', error);
    return [];
  }
};

// Remove the firebaseUIDToUUID function definition since it's imported
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
