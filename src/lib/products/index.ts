
// Re-export types
export type { Product, ProductCategory, ProductReview } from './types';

// Export any other product-related functions
export * from './utils';
export * from './api';

// Export from filters but avoid naming conflicts
export { 
  getProductsByCategory,
  getProductsByTags,
  getTopRatedProducts,
  getDiscountedProducts,
  getBestSellingProducts
} from './filters';

// Export newArrivals with specific naming to avoid conflicts
export { getNewArrivals as getNewArrivalsFromFilters } from './filters';
export { getNewArrivals } from './newArrivals';

export * from './collections';

// Re-export productStore from types/product.ts
export { productStore } from '@/lib/types/product';

// Import Product type for mockProducts
import { Product } from './types';

// Mock product data for development
export const mockProducts: Product[] = [];
