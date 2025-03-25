import { supabase } from '@/integrations/supabase/client';
import { Shop, adaptShopData } from '@/lib/shops/types';
import { Product } from '@/lib/products/types';

const defaultShopValues = {
  website: '',
  social_media: { facebook: '', twitter: '', instagram: '', pinterest: '' },
  categories: [],
  product_count: 0,
  tags: []
};

export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data.map(shop => adaptShopData({
      ...shop,
      ...defaultShopValues
    })) as Shop[];
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};

export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
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
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

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
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

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

export const verifyShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ is_verified: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error verifying shop:', error);
    return null;
  }
};

export const suspendShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ status: 'suspended' as ShopStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error suspending shop:', error);
    return null;
  }
};

export const activateShop = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({ status: 'active' as ShopStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return adaptShopData({
      ...data,
      ...defaultShopValues
    }) as Shop;
  } catch (error) {
    console.error('Error activating shop:', error);
    return null;
  }
};

export const getVerifiedShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(shop => adaptShopData({
      ...shop,
      ...defaultShopValues
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching verified shops:', error);
    return [];
  }
};

export const getTrendingShops = async (limit = 5): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('followers_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(shop => adaptShopData({
      ...shop,
      ...defaultShopValues
    })) as Shop[];
  } catch (error) {
    console.error('Error fetching trending shops:', error);
    return [];
  }
};

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
    
    if (data.password === password) {
      return data.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking shop credentials:', error);
    return null;
  }
};

export { ShopStatus } from '@/lib/shops/types';
