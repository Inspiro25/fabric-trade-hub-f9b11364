
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/lib/shops/types';

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
    
    if (!data) return null;
    
    // Ensure status is of the correct type
    const status = data.status as 'active' | 'pending' | 'suspended';
    
    // Map database fields to our Shop type
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      logo: data.logo || '',
      cover_image: data.cover_image || '',
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      followers_count: data.followers_count || 0,
      owner_name: data.owner_name || '',
      owner_email: data.owner_email || '',
      phone_number: data.phone_number || '',
      address: data.address || '',
      status: status || 'pending',
      is_verified: data.is_verified || false,
      created_at: data.created_at,
      shop_id: data.shop_id,
      password: data.password
    };
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

export const updateShop = async (
  id: string, 
  shopData: Partial<Shop>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .update(shopData)
      .eq('id', id);
      
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

export const fetchShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data.map(shop => ({
      ...shop,
      status: shop.status as 'active' | 'pending' | 'suspended'
    })) || [];
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};

export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Ensure name is present as it's required by supabase
    if (!shopData.name) {
      console.error('Shop name is required');
      return null;
    }

    const { data, error } = await supabase
      .from('shops')
      .insert([shopData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as 'active' | 'pending' | 'suspended'
    };
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

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

export const fetchShopFollowers = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('shop_follower_details')
      .select('*')
      .eq('shop_id', shopId)
      .order('followed_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching shop followers:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchShopFollowers:', error);
    return [];
  }
};

export const fetchShopSalesAnalytics = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('shop_sales_analytics')
      .select('*')
      .eq('shop_id', shopId)
      .order('date', { ascending: false })
      .limit(30);
      
    if (error) {
      console.error('Error fetching shop sales analytics:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchShopSalesAnalytics:', error);
    return [];
  }
};

export const checkShopCredentials = async (name: string, password: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('id, password')
      .eq('name', name)
      .single();
      
    if (error || !data) {
      console.error('Error checking shop credentials:', error);
      return null;
    }
    
    // Very basic check - in a real app you would use proper password hashing
    if (data.password === password) {
      return data.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error in checkShopCredentials:', error);
    return null;
  }
};

export const getShopsByIds = async (shopIds: string[]): Promise<Shop[]> => {
  if (!shopIds.length) return [];
  
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .in('id', shopIds);
      
    if (error) {
      console.error('Error fetching shops by ids:', error);
      return [];
    }
    
    return data.map(shop => ({
      ...shop,
      status: shop.status as 'active' | 'pending' | 'suspended'
    })) || [];
  } catch (error) {
    console.error('Error in getShopsByIds:', error);
    return [];
  }
};

export const getPopularShops = async (limit = 5): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('status', 'active')
      .order('followers_count', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching popular shops:', error);
      return [];
    }
    
    return data.map(shop => ({
      ...shop,
      status: shop.status as 'active' | 'pending' | 'suspended'
    })) || [];
  } catch (error) {
    console.error('Error in getPopularShops:', error);
    return [];
  }
};
