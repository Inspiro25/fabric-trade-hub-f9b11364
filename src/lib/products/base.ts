
import { supabase } from '@/lib/supabase';
import { Product, normalizeProduct, productStore } from '@/lib/types/product';

// Base function to fetch products with filters
export const fetchProducts = async (
  options: {
    limit?: number;
    page?: number;
    category?: string;
    search?: string;
    sort?: string;
    filters?: Record<string, any>;
  } = {}
): Promise<Product[]> => {
  const { limit = 10, page = 1, category, search, sort, filters = {} } = options;
  const offset = (page - 1) * limit;

  try {
    let query = supabase.from('products').select('*');

    // Apply category filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply search
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });

    // Apply sorting
    if (sort) {
      const [field, order] = sort.split(':');
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return productStore.products.slice(0, limit);
    }

    return data?.map(normalizeProduct) || productStore.products.slice(0, limit);
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return productStore.products.slice(0, limit);
  }
};

// Get a single product by ID
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      const fallbackProduct = productStore.products.find(p => p.id === id);
      return fallbackProduct || null;
    }

    return normalizeProduct(data);
  } catch (error) {
    console.error('Error in getProduct:', error);
    const fallbackProduct = productStore.products.find(p => p.id === id);
    return fallbackProduct || null;
  }
};
