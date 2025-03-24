
import { Shop } from './types';
import { getShopById, fetchShops, updateShop, createShop, deleteShop } from '@/lib/supabase/shops';
import mockShops from './mockData';

// Re-export the functions to provide a consistent API
export { 
  getShopById, 
  fetchShops, 
  updateShop, 
  createShop, 
  deleteShop,
  mockShops 
};

// Export the shop products related functions
export * from './products';

// Additional functions can be added here for specific business logic
export const getActiveShops = async (): Promise<Shop[]> => {
  const shops = await fetchShops();
  return shops.filter(shop => shop.status === 'active');
};

export const getVerifiedShops = async (): Promise<Shop[]> => {
  const shops = await fetchShops();
  return shops.filter(shop => shop.is_verified);
};
