
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
export * from './products';
export * from './deal';
export * from './filters';
export * from './categories';
export * from './collections';
export * from './newArrivals';
export * from './base';
