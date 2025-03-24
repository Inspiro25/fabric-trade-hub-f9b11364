
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopStatus } from '@/lib/shops/types';
import { v4 as uuidv4 } from 'uuid';

// Function to get a shop by its ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Ensure the status is of the correct type
    const status = data.status as ShopStatus;
    
    return {
      ...data,
      status
    } as Shop;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

// Function to fetch all shops
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Ensure each shop has the correct status type
    return (data || []).map(shop => ({
      ...shop,
      status: shop.status as ShopStatus
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure the status is of the correct type if it's being updated
    let updatedData = { ...shopData };
    if (updatedData.status) {
      updatedData.status = updatedData.status as ShopStatus;
    }
    
    const { data, error } = await supabase
      .from('shops')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      status: data.status as ShopStatus
    } as Shop;
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

// Function to create a new shop
export const createShop = async (shopData: Omit<Shop, 'id' | 'created_at'>): Promise<Shop | null> => {
  try {
    const newShop = {
      ...shopData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: shopData.status as ShopStatus
    };
    
    const { data, error } = await supabase
      .from('shops')
      .insert([newShop])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Shop;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting shop:', error);
    return false;
  }
};

// Function to verify a shop
export const verifyShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ is_verified: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      status: data.status as ShopStatus
    } as Shop;
  } catch (error) {
    console.error('Error verifying shop:', error);
    return null;
  }
};

// Function to suspend a shop
export const suspendShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ status: 'suspended' as ShopStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Shop;
  } catch (error) {
    console.error('Error suspending shop:', error);
    return null;
  }
};

// Function to activate a shop
export const activateShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ status: 'active' as ShopStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Shop;
  } catch (error) {
    console.error('Error activating shop:', error);
    return null;
  }
};

// Function to get verified shops
export const getVerifiedShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(shop => ({
      ...shop,
      status: shop.status as ShopStatus
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching verified shops:', error);
    return [];
  }
};

// Function to get trending shops
export const getTrendingShops = async (limit = 5): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('followers_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(shop => ({
      ...shop,
      status: shop.status as ShopStatus
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching trending shops:', error);
    return [];
  }
};
