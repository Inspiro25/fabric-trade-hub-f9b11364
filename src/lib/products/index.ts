
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
export const mockProducts: Product[] = [
  // Add some mock products here for development
  {
    id: '1',
    name: 'Sample Product 1',
    description: 'This is a sample product description',
    price: 29.99,
    images: ['/placeholder.png'],
    category: 'Electronics',
    category_id: '1',
    rating: 4.5,
    reviewCount: 12,
    review_count: 12,
    stock: 100,
    colors: ['black', 'white'],
    sizes: ['S', 'M', 'L'],
    tags: ['featured', 'new']
  },
  {
    id: '2',
    name: 'Sample Product 2',
    description: 'Another sample product description',
    price: 49.99,
    images: ['/placeholder.png'],
    category: 'Clothing',
    category_id: '2',
    rating: 4.0,
    reviewCount: 8,
    review_count: 8,
    stock: 50,
    colors: ['red', 'blue'],
    sizes: ['M', 'L', 'XL'],
    tags: ['sale', 'popular']
  }
];
