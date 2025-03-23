
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types/product';

// Unified interface for product fetching parameters
interface ProductFetchParams {
  limit?: number;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  hasDiscount?: boolean;
  minRating?: number;
  shopId?: string;
  tags?: string[];
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
  excludeIds?: string[];
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

// Convert a database product to our Product type
const mapDbProductToProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description || '',
  price: dbProduct.price,
  salePrice: dbProduct.sale_price,
  images: dbProduct.images || [],
  category: dbProduct.category_id || '',
  colors: dbProduct.colors || [],
  sizes: dbProduct.sizes || [],
  isNew: dbProduct.is_new || false,
  isTrending: dbProduct.is_trending || false,
  rating: dbProduct.rating || 0,
  reviewCount: dbProduct.review_count || 0,
  stock: dbProduct.stock || 0,
  tags: dbProduct.tags || [],
  shopId: dbProduct.shop_id || '',
});

// Main function to fetch products with various filters
export const fetchProducts = async ({
  limit,
  category,
  isNew,
  isTrending,
  hasDiscount,
  minRating,
  shopId,
  tags,
  sortBy,
  excludeIds = [],
  searchTerm,
  page = 1,
  pageSize = 12
}: ProductFetchParams): Promise<{ products: Product[]; total: number }> => {
  try {
    // Start building query
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    // Add filters
    if (category) {
      query = query.eq('category_id', category);
    }
    
    if (isNew) {
      query = query.eq('is_new', true);
    }
    
    if (isTrending) {
      query = query.eq('is_trending', true);
    }
    
    if (hasDiscount) {
      query = query.not('sale_price', 'is', null);
    }
    
    if (minRating) {
      query = query.gte('rating', minRating);
    }
    
    if (shopId) {
      query = query.eq('shop_id', shopId);
    }
    
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    
    // Add sorting
    if (sortBy) {
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
        default:
          break;
      }
    }
    
    // Add limit if specified
    if (limit) {
      query = query.limit(limit);
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    // Map database products to our Product type
    const products = data ? data.map(mapDbProductToProduct) : [];
    
    return { products, total: count || 0 };
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return { products: [], total: 0 };
  }
};

// Get related products based on category and tags
export const fetchRelatedProducts = async (
  productId: string,
  category: string,
  tags: string[] = [],
  limit = 4
): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
      category,
      limit,
      excludeIds: [productId],
      tags: tags.length > 0 ? tags : undefined,
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

// Get new arrivals
export const fetchNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
      isNew: true,
      sortBy: 'newest',
      limit,
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

// Get trending products
export const fetchTrendingProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
      isTrending: true,
      sortBy: 'popularity',
      limit,
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};

// Get discounted products
export const fetchDiscountedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
      hasDiscount: true,
      limit,
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    return [];
  }
};

// Get top-rated products
export const fetchTopRatedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { products } = await fetchProducts({
      minRating: 4,
      sortBy: 'rating',
      limit,
    });
    
    return products;
  } catch (error) {
    console.error('Error fetching top-rated products:', error);
    return [];
  }
};

// Get products by category
export const fetchProductsByCategory = async (
  category: string,
  page = 1,
  pageSize = 12,
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'
): Promise<{ products: Product[]; total: number }> => {
  try {
    return await fetchProducts({
      category,
      page,
      pageSize,
      sortBy,
    });
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return { products: [], total: 0 };
  }
};

// Get products by shop
export const fetchProductsByShop = async (
  shopId: string,
  page = 1,
  pageSize = 12,
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'
): Promise<{ products: Product[]; total: number }> => {
  try {
    return await fetchProducts({
      shopId,
      page,
      pageSize,
      sortBy,
    });
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return { products: [], total: 0 };
  }
};

// Get products by search term
export const fetchProductsBySearch = async (
  searchTerm: string,
  page = 1,
  pageSize = 12,
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'
): Promise<{ products: Product[]; total: number }> => {
  try {
    return await fetchProducts({
      searchTerm,
      page,
      pageSize,
      sortBy,
    });
  } catch (error) {
    console.error(`Error fetching products for search ${searchTerm}:`, error);
    return { products: [], total: 0 };
  }
};

// React Query hooks for different product fetching scenarios
export const useProducts = (params: ProductFetchParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useNewArrivals = (limit = 8) => {
  return useQuery({
    queryKey: ['products', 'newArrivals', limit],
    queryFn: () => fetchNewArrivals(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTrendingProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['products', 'trending', limit],
    queryFn: () => fetchTrendingProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDiscountedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['products', 'discounted', limit],
    queryFn: () => fetchDiscountedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedProducts = (limit = 8) => {
  return useQuery({
    queryKey: ['products', 'topRated', limit],
    queryFn: () => fetchTopRatedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductsByCategory = (
  category: string,
  page = 1,
  pageSize = 12,
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'
) => {
  return useQuery({
    queryKey: ['products', 'category', category, page, pageSize, sortBy],
    queryFn: () => fetchProductsByCategory(category, page, pageSize, sortBy),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });
};

export const useProductById = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }
        
        if (!data) return null;
        
        return mapDbProductToProduct(data);
      } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
  });
};

export const useRelatedProducts = (
  productId: string | undefined,
  category: string | undefined,
  tags: string[] = [],
  limit = 4
) => {
  return useQuery({
    queryKey: ['products', 'related', productId, category, tags, limit],
    queryFn: () => {
      if (!productId || !category) return [];
      return fetchRelatedProducts(productId, category, tags, limit);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!productId && !!category,
  });
};
