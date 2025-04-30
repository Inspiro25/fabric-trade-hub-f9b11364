
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

// Mock product data for development
export const mockProducts: Product[] = [];
export const productStore = { products: mockProducts };
