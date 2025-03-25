
// Re-export shop types and utilities
export * from './types';
export { mockShops, getPopularShops, getVerifiedShops, getShopById } from './mockData';

// Import necessary utilities
import { mockShops } from './mockData';
import { Shop, adaptShopData } from './types';

// Get a list of all shops
export const getAllShops = (): Shop[] => {
  return mockShops;
};

// Get a shop by ID
export const findShopById = (id: string): Shop | undefined => {
  return mockShops.find(shop => shop.id === id);
};

// Search shops by name
export const searchShops = (query: string): Shop[] => {
  const normalizedQuery = query.toLowerCase();
  return mockShops.filter(shop => (
    shop.name.toLowerCase().includes(normalizedQuery) ||
    shop.description.toLowerCase().includes(normalizedQuery)
  ));
};

// Filter shops by category
export const filterShopsByCategory = (category: string): Shop[] => {
  const normalizedCategory = category.toLowerCase();
  return mockShops.filter(shop => 
    shop.categories.some(cat => cat.toLowerCase() === normalizedCategory)
  );
};

// Get trending shops (most followers)
export const getTrendingShops = (limit = 5): Shop[] => {
  return [...mockShops]
    .sort((a, b) => b.followers_count - a.followers_count)
    .slice(0, limit);
};

// Get newest shops
export const getNewestShops = (limit = 5): Shop[] => {
  return [...mockShops]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

// Adapter function to convert any shop data format to our Shop type
export const adaptShopFromAPI = (data: any): Shop => {
  return adaptShopData(data);
};
