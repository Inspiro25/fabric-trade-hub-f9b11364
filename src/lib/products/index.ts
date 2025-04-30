
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

// Add these missing exports
export const productStore = {
  products: [],
  updateProducts: (products: any[]) => { /* Implementation */ },
  addProduct: (product: any) => { /* Implementation */ },
  updateProduct: (id: string, data: any) => { /* Implementation */ },
  removeProduct: (id: string) => { /* Implementation */ },
};

export const mockProducts = [];
