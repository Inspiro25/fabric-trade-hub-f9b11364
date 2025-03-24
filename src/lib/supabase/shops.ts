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
    
    // Transform the data to match the Shop interface
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
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
      .select('*');
      
    if (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(shop => ({
      id: shop.id,
      name: shop.name,
      logo: shop.logo || '',
      cover_image: shop.cover_image || '',
      description: shop.description || '',
      owner_name: shop.owner_name || '',
      owner_email: shop.owner_email || '',
      address: shop.address || '',
      phone: shop.phone_number || '',
      phone_number: shop.phone_number || '',
      website: shop.website || '',
      social_media: shop.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: shop.categories || [],
      is_verified: shop.is_verified || false,
      rating: shop.rating || 0,
      review_count: shop.review_count || 0,
      followers_count: shop.followers_count || 0,
      product_count: shop.product_count || 0,
      created_at: shop.created_at,
      tags: shop.tags || [],
      status: shop.status as string,
      shop_id: shop.shop_id || ''
    })) as Shop[];
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Convert the Shop interface to match what the database expects
    const dbShopData = {
      ...shopData,
      phone_number: shopData.phone || shopData.phone_number,
      shop_id: shopData.shop_id
    };
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbShopData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
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
      status: shopData.status as ShopStatus,
      product_count: shopData.product_count || 0
    };
    
    const { data, error } = await supabase
      .from('shops')
      .insert([newShop])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
    } as Shop;
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
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
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
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
    } as Shop;
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
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      description: data.description || '',
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      address: data.address || '',
      phone: data.phone_number || '',
      phone_number: data.phone_number || '',
      website: data.website || '',
      social_media: data.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: data.categories || [],
      is_verified: data.is_verified || false,
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      tags: data.tags || [],
      status: data.status as string,
      shop_id: data.shop_id || ''
    } as Shop;
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
      id: shop.id,
      name: shop.name,
      logo: shop.logo || '',
      cover_image: shop.cover_image || '',
      description: shop.description || '',
      owner_name: shop.owner_name || '',
      owner_email: shop.owner_email || '',
      address: shop.address || '',
      phone: shop.phone_number || '',
      phone_number: shop.phone_number || '',
      website: shop.website || '',
      social_media: shop.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: shop.categories || [],
      is_verified: shop.is_verified || false,
      rating: shop.rating || 0,
      review_count: shop.review_count || 0,
      followers_count: shop.followers_count || 0,
      product_count: shop.product_count || 0,
      created_at: shop.created_at,
      tags: shop.tags || [],
      status: shop.status as string,
      shop_id: shop.shop_id || ''
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
      id: shop.id,
      name: shop.name,
      logo: shop.logo || '',
      cover_image: shop.cover_image || '',
      description: shop.description || '',
      owner_name: shop.owner_name || '',
      owner_email: shop.owner_email || '',
      address: shop.address || '',
      phone: shop.phone_number || '',
      phone_number: shop.phone_number || '',
      website: shop.website || '',
      social_media: shop.social_media || { facebook: '', twitter: '', instagram: '', pinterest: '' },
      categories: shop.categories || [],
      is_verified: shop.is_verified || false,
      rating: shop.rating || 0,
      review_count: shop.review_count || 0,
      followers_count: shop.followers_count || 0,
      product_count: shop.product_count || 0,
      created_at: shop.created_at,
      tags: shop.tags || [],
      status: shop.status as string,
      shop_id: shop.shop_id || ''
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching trending shops:', error);
    return [];
  }
};

// Function to check shop credentials (username/password)
export const checkShopCredentials = async (shopName: string, password: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('id, name, password')
      .eq('name', shopName)
      .single();
    
    if (error) {
      console.error('Error checking shop credentials:', error);
      return null;
    }
    
    if (!data) {
      console.log('Shop not found');
      return null;
    }
    
    // Simple password check (in a real app, you'd use proper password hashing)
    if (data.password === password) {
      return data.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking shop credentials:', error);
    return null;
  }
};

// Export the ShopStatus enum to use in other files
export { ShopStatus } from '@/lib/shops/types';
