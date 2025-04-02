
// Re-export types from types/product
import {
  Product,
  CartItem,
  CartContextType,
  WishlistContextType,
  normalizeProduct,
  productStore,
  SearchPageProduct
} from '../types/product';

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

// Re-export create/update/delete functions from products.ts
export { 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getAllProducts,
  getAllCategories,
  fetchProductById,
  getProductById,
  createProduct 
} from '../lib/products';

// If fetchDealProducts doesn't exist yet, let's create a simple implementation
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
