
// Export types
export type { Shop } from './types';

// Export the mock data for testing
export { shops } from './mockData';

// Export CRUD methods
export { 
  fetchShops, 
  getShopById, 
  updateShop, 
  createShop, 
  deleteShop 
} from './crud';

// Export products methods
export { getShopProducts } from './products';
