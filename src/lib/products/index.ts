
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

// Re-export functions from other modules - explicitly renaming to avoid ambiguity
export { fetchProducts } from './products';
export { fetchNewArrivals, fetchNewArrivalsForCategory, getNewArrivals } from './newArrivals';
export { fetchDealProducts } from './deal';
export * from './filters';
export * from './categories';
export * from './collections';
export * from './base';

// Re-export create/update/delete functions
export { 
  addProduct, 
  updateProduct, 
  deleteProduct,
  createProduct,
  getAllProducts,
  getAllCategories,
  fetchProductById,
  getProductById
} from '../products';
