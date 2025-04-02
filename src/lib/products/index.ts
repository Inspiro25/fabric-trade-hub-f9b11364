
import { Product, CartItem, CartContextType, WishlistContextType, normalizeProduct } from '../types/product';

export type {
  Product,
  CartItem, 
  CartContextType,
  WishlistContextType
};

export { normalizeProduct };

// Re-export functions from other modules
export * from './products';
export * from './deal';
export * from './filters';
export * from './categories';
export * from './collections';
export * from './trending';
export * from './newArrivals';
export * from './base';

