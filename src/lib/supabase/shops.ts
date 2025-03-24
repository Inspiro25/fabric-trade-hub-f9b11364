
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
      status: data.status || 'pending',
      is_verified: data.is_verified || false
    };
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

export const updateShop = async (
  id: string, 
  shopData: Partial<Omit<Shop, 'id'>> & { password?: string }
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
    
    return (data || []).map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      logo: shop.logo || '',
      cover_image: shop.cover_image || '',
      rating: shop.rating || 0,
      review_count: shop.review_count || 0,
      followers_count: shop.followers_count || 0,
      owner_name: shop.owner_name || '',
      owner_email: shop.owner_email || '',
      phone_number: shop.phone_number || '',
      address: shop.address || '',
      status: shop.status || 'pending',
      is_verified: shop.is_verified || false
    }));
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
    
    return (data || []).map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      logo: shop.logo || '',
      cover_image: shop.cover_image || '',
      rating: shop.rating || 0,
      review_count: shop.review_count || 0,
      followers_count: shop.followers_count || 0,
      owner_name: shop.owner_name || '',
      owner_email: shop.owner_email || '',
      phone_number: shop.phone_number || '',
      address: shop.address || '',
      status: shop.status || 'pending',
      is_verified: shop.is_verified || false
    }));
  } catch (error) {
    console.error('Error in getPopularShops:', error);
    return [];
  }
};
