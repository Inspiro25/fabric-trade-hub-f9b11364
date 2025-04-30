
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

// Import and re-export the product store from its correct location
import { Product } from './types';

// Mock product data for development
export const mockProducts: Product[] = [];
export const productStore = { products: mockProducts };
