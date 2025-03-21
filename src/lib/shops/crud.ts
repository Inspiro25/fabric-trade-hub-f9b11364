
import { Shop } from './types';
import { mockShops, shops } from './mockData';
import { 
  fetchShops as supabaseFetchShops,
  getShopById as supabaseGetShopById,
  updateShop as supabaseUpdateShop,
  createShop as supabaseCreateShop,
  deleteShop as supabaseDeleteShop
} from '@/lib/supabase/shops';

// Function to fetch all shops from Supabase
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const fetchedShops = await supabaseFetchShops();
    
    if (fetchedShops.length === 0) {
      console.log('No shops found in database, using mock data');
      return mockShops;
    }
    
    // Update the shops reference
    Object.assign(shops, fetchedShops);
    
    return fetchedShops;
  } catch (error) {
    console.error('Error fetching shops:', error);
    return mockShops; // Fallback to mock data
  }
};

// Initialize shops from database
(async () => {
  try {
    const fetchedShops = await fetchShops();
    Object.assign(shops, fetchedShops);
  } catch (error) {
    console.error('Failed to initialize shops from database:', error);
  }
})();

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | undefined> => {
  try {
    const shop = await supabaseGetShopById(id);
    
    if (shop) {
      return shop;
    }
    
    // Try to find in local cache if not in database
    return shops.find(shop => shop.id === id);
  } catch (error) {
    console.error(`Error fetching shop ${id}:`, error);
    return shops.find(shop => shop.id === id); // Fallback to local shops array
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    const success = await supabaseUpdateShop(id, shopData);
    
    if (success) {
      console.info('Shop details updated:', shopData);
      
      // Update local cache
      const shopIndex = shops.findIndex(shop => shop.id === id);
      if (shopIndex !== -1) {
        shops[shopIndex] = { ...shops[shopIndex], ...shopData };
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error updating shop:', error);
    return false;
  }
};

// Function to create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<string | null> => {
  try {
    const shopId = await supabaseCreateShop(shopData);
    
    if (shopId) {
      const newShop = {
        id: shopId,
        ...shopData,
      };
      
      // Update local cache
      shops.push(newShop);
      
      return shopId;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const success = await supabaseDeleteShop(id);
    
    if (success) {
      // Update local cache
      const shopIndex = shops.findIndex(shop => shop.id === id);
      if (shopIndex !== -1) {
        shops.splice(shopIndex, 1);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};
