import { supabase } from './client';
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

// Check shop credentials for login
export const checkShopCredentials = async (shopId: string, password: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('shop_id', shopId)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      console.error('Invalid credentials or error:', error);
      return null;
    }
    
    return adaptShopData(data);
  } catch (error) {
    console.error('Error checking shop credentials:', error);
    return null;
  }
};

// Additional shop-related functions can be added here
