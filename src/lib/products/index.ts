
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

// Add mock products for testing
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
