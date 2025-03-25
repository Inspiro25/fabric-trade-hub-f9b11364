
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopStatus } from '@/lib/shops/types';
import { v4 as uuidv4 } from 'uuid';

// Fix the adaptShopData function to properly cast database results to our Shop type
const adaptShopDataFromDB = (shopData: any): Shop => {
  return {
    id: shopData.id || '',
    name: shopData.name || '',
    logo: shopData.logo || '',
    cover_image: shopData.cover_image || '',
    description: shopData.description || '',
    owner_name: shopData.owner_name || '',
    owner_email: shopData.owner_email || '',
    address: shopData.address || '',
    phone: shopData.phone || '',
    website: shopData.website || '',
    social_media: shopData.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
    categories: shopData.categories || [],
    is_verified: shopData.is_verified || false,
    rating: shopData.rating || 0,
    review_count: shopData.review_count || 0,
    followers_count: shopData.followers_count || 0,
    product_count: shopData.product_count || 0,
    created_at: shopData.created_at || new Date().toISOString(),
    tags: shopData.tags || [],
    status: shopData.status || ShopStatus.Pending
  };
};

// Get all shops
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return (data || []).map(shopData => adaptShopDataFromDB(shopData));
  } catch (error) {
    console.error('Error in getAllShops:', error);
    return [];
  }
};

// Get a single shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return adaptShopDataFromDB(data);
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure we have a valid ID
    const newShop = {
      id: uuidv4(),
      name: shopData.name || 'New Shop',
      description: shopData.description || '',
      logo: shopData.logo || '',
      cover_image: shopData.cover_image || '',
      owner_name: shopData.owner_name || '',
      owner_email: shopData.owner_email || '',
      address: shopData.address || '',
      phone: shopData.phone || '',
      website: shopData.website || '',
      social_media: shopData.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: shopData.categories || [],
      is_verified: shopData.is_verified || false,
      rating: shopData.rating || 0,
      review_count: shopData.review_count || 0,
      followers_count: shopData.followers_count || 0,
      product_count: shopData.product_count || 0,
      tags: shopData.tags || [],
      status: shopData.status || ShopStatus.Pending,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('shops')
      .insert([newShop])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return adaptShopDataFromDB(data);
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Update an existing shop
export const updateShop = async (id: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    return adaptShopDataFromDB(data);
  } catch (error) {
    console.error('Error in updateShop:', error);
    return null;
  }
};

// Delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
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

// Get top-rated shops
export const getTopRatedShops = async (limit = 5): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top rated shops:', error);
      return [];
    }
    
    return (data || []).map(shopData => adaptShopDataFromDB(shopData));
  } catch (error) {
    console.error('Error in getTopRatedShops:', error);
    return [];
  }
};

// Get shops by status
export const getShopsByStatus = async (status: ShopStatus, limit = 10): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('status', status)
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching shops with status ${status}:`, error);
      return [];
    }
    
    return (data || []).map(shopData => adaptShopDataFromDB(shopData));
  } catch (error) {
    console.error(`Error in getShopsByStatus for ${status}:`, error);
    return [];
  }
};

// Search shops
export const searchShops = async (query: string, limit = 10): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Error searching shops:', error);
      return [];
    }
    
    return (data || []).map(shopData => adaptShopDataFromDB(shopData));
  } catch (error) {
    console.error('Error in searchShops:', error);
    return [];
  }
};

// Get shops by category
export const getShopsByCategory = async (category: string, limit = 10): Promise<Shop[]> => {
  try {
    // Since categories is an array field, we need a different approach
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .filter('categories', 'cs', `{${category}}`)
      .limit(limit);
    
    if (error) {
      console.error(`Error fetching shops in category ${category}:`, error);
      return [];
    }
    
    return (data || []).map(shopData => adaptShopDataFromDB(shopData));
  } catch (error) {
    console.error(`Error in getShopsByCategory for ${category}:`, error);
    return [];
  }
};
