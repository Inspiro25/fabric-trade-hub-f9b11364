
// Re-export types
export type { Product, ProductCategory, ProductReview } from './types';

// Export any other product-related functions
export * from './utils';
export * from './api';
export * from './filters';
export * from './newArrivals';
export * from './collections';

// Re-export the Product type for compatibility 
export { productStore, mockProducts } from './types';
