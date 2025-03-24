
// Re-export all product related functionality
export * from '@/lib/types/product';
export * from '@/lib/products/base';
export { 
  getRelatedProducts,
  getNewArrivals,
  getProductsByCategory,
  getProductsByTags,
  // Rename the one from filters to avoid conflict
  getTrendingProducts as getBasicTrendingProducts
} from '@/lib/products/filters';
export * from '@/lib/products/categories';
export * from '@/lib/products/collections';
export * from '@/lib/products/deal';
export * from '@/lib/products/trending';
export { mockProducts } from '@/lib/products/mockData'; // Export mockProducts

// Import necessary types and functionality
import { Product, adaptProduct } from '@/lib/products/types';
import { supabase } from '@/integrations/supabase/client';

// Add this function to fetch a single product by ID
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    // If we're connected to Supabase, fetch from database
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    if (data) {
      // Use adaptProduct to correctly format the product
      return adaptProduct(data);
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

// Add a specialized function to get the latest new arrivals
export const getLatestNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    // Get products marked as new, ordered by created_at date
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching latest new arrivals:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map database products to our Product type using adaptProduct
    return data.map(product => adaptProduct(product));
  } catch (error) {
    console.error('Error in getLatestNewArrivals:', error);
    return [];
  }
};
