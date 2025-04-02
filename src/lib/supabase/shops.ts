
import { supabase } from '@/integrations/supabase/client';
import { Shop, adaptShopData } from '@/lib/shops/types';

// Fetch all shops
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map database shops to our Shop type
    return data.map(shop => adaptShopData(shop));
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};

// Get a shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return adaptShopData(data);
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Update shop details
export const updateShop = async (shopId: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    // Filter out any undefined values
    const filteredData: Record<string, any> = {};
    Object.entries(shopData).forEach(([key, value]) => {
      if (value !== undefined) {
        filteredData[key] = value;
      }
    });
    
    const { error } = await supabase
      .from('shops')
      .update(filteredData)
      .eq('id', shopId);
    
    if (error) {
      console.error('Error updating shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateShop:', error);
    return false;
  }
};

// Create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure name field is present
    if (!shopData.name) {
      throw new Error("Shop name is required");
    }
    
    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return adaptShopData(data);
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Delete a shop
export const deleteShop = async (shopId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteShop:', error);
    return false;
  }
};

// Check shop credentials for login
export const checkShopCredentials = async (shopId: string, password: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('id')
      .eq('shop_id', shopId)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      console.error('Invalid credentials or error:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error checking shop credentials:', error);
    return null;
  }
};
