
// Re-export types from types directory
import { Product, SearchPageProduct } from './types';
import {
  CartItem,
  CartContextType,
  WishlistContextType,
  normalizeProduct,
  productStore,
} from '@/types/product';

export type {
  Product,
  CartItem,
  CartContextType,
  WishlistContextType,
  SearchPageProduct
};

export {
  normalizeProduct,
  productStore
};

// Re-export functions from other modules
export { fetchProducts } from './products';
export { fetchNewArrivals, fetchNewArrivalsForCategory, getNewArrivals } from './newArrivals';

// Export all from these modules
export * from './filters';
export * from './categories';
export * from './collections';
export * from './base';

// Re-export create/update/delete functions
export { 
  updateProduct, 
  deleteProduct,
  fetchProductById,
  getProductById,
  createProduct 
} from '@/lib/supabase/products';

// Add product functions
export { addProduct, getAllProducts, getAllCategories } from '@/lib/supabase/products';

// Export fetchDealProducts function
export const fetchDealProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('sale_price', 'is', null)
      .order('sale_price', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching deal products:', error);
    return [];
  }
};
