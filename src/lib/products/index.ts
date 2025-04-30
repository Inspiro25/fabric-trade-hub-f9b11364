
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
export { getNewArrivals as getNewArrivalsFromDB } from './newArrivals';

export * from './collections';

// Add the Product store from the correct location
import { productStore, mockProducts } from '@/lib/types/product';
export { productStore, mockProducts };
