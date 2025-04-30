
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '../shops/types';

// Fetch all shops
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const { data: shops, error } = await supabase
      .from('shops')
      .select(`
        id,
        name,
        description,
        logo,
        cover_image,
        address,
        owner_name,
        owner_email,
        phone_number,
        rating,
        review_count,
        followers_count,
        is_verified,
        status,
        created_at,
        shop_id,
        password
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }

    return shops as Shop[];
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};

// Fetch a shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

// Create a new shop
export const createShop = async (shopData: Omit<Shop, 'id' | 'rating' | 'review_count' | 'followers_count' | 'created_at'>): Promise<string | null> => {
  try {
    // Ensure status is valid
    const validStatus = ['active', 'pending', 'suspended'].includes(shopData.status)
      ? shopData.status
      : 'pending';
      
    const { data, error } = await supabase
      .from('shops')
      .insert([{ ...shopData, status: validStatus }])
      .select();

    if (error) throw error;
    return data?.[0]?.id || null;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    // Make sure status is valid if provided
    const updateData = { ...shopData };
    if (updateData.status && !['active', 'pending', 'suspended'].includes(updateData.status)) {
      updateData.status = 'pending';
    }
    
    const { error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating shop:', error);
    return false;
  }
};

// Delete a shop
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
