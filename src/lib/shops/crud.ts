import { Shop } from './types';
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
    return fetchedShops;
  } catch (error) {
    console.error('Error fetching shops:', error);
    return []; // Return empty array as fallback
  }
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | undefined> => {
  try {
    const shop = await supabaseGetShopById(id);
    return shop;
  } catch (error) {
    console.error(`Error fetching shop ${id}:`, error);
    return undefined;
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    const success = await supabaseUpdateShop(id, shopData);
    
    if (success) {
      console.info('Shop details updated:', shopData);
      
      // Update analytics if needed
      await updateShopAnalytics(id);
      
      return true;
    }
    
    return false;
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
      // Create initial analytics record
      await createInitialShopAnalytics(shopId);
      
      // Update platform analytics for new shop
      await updatePlatformAnalyticsForNewShop();
      
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
    return success;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};

// Create initial analytics record for a new shop
const createInitialShopAnalytics = async (shopId: string): Promise<void> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Initial analytics record with zero values
    const { error } = await supabase
      .from('shop_analytics')
      .insert({
        shop_id: shopId,
        date: today,
        revenue: 0,
        orders: 0,
        visitors: 0,
        conversion_rate: 0
      });
    
    if (error) {
      console.error('Error creating initial shop analytics:', error);
    }
  } catch (error) {
    console.error('Error in createInitialShopAnalytics:', error);
  }
};

// Update platform analytics when a new shop is created
const updatePlatformAnalyticsForNewShop = async (): Promise<void> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we have a record for today
    const { data: existingRecord, error: queryError } = await supabase
      .from('platform_analytics')
      .select('id, new_shops')
      .eq('date', today)
      .maybeSingle();
    
    if (queryError) {
      console.error('Error querying platform analytics:', queryError);
      return;
    }
    
    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('platform_analytics')
        .update({
          new_shops: (existingRecord.new_shops || 0) + 1
        })
        .eq('id', existingRecord.id);
      
      if (updateError) {
        console.error('Error updating platform analytics:', updateError);
      }
    } else {
      // Create new record for today
      const { error: insertError } = await supabase
        .from('platform_analytics')
        .insert({
          date: today,
          new_shops: 1,
          total_revenue: 0,
          total_orders: 0,
          new_users: 0
        });
      
      if (insertError) {
        console.error('Error inserting platform analytics:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in updatePlatformAnalyticsForNewShop:', error);
  }
};

// Update shop analytics after shop update
const updateShopAnalytics = async (shopId: string): Promise<void> => {
  try {
    // This is a placeholder for actual analytics updates
    // In a real app, you might want to update analytics based on shop activity
    console.log(`Shop ${shopId} analytics should be updated here`);
  } catch (error) {
    console.error('Error in updateShopAnalytics:', error);
  }
};
