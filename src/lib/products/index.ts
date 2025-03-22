
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
