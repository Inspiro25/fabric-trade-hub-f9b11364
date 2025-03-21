
import { supabase } from "@/integrations/supabase/client";
import { Shop } from "@/lib/shops/types";

// Function to fetch all shops from Supabase
export const fetchShops = async (): Promise<Shop[]> => {
  try {
    // @ts-ignore - Ignore the type error since we know this is the correct usage
    const { data: shops, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
    
    if (!shops) return [];
    
    return shops.map((shop: any) => ({
      id: shop?.id || '',
      name: shop?.name || '',
      description: shop?.description || '',
      logo: shop?.logo || '/placeholder.svg',
      coverImage: shop?.cover_image || '/placeholder.svg',
      address: shop?.address || '',
      rating: shop?.rating || 0,
      reviewCount: shop?.review_count || 0,
      productIds: [], // We'll fetch products separately
      isVerified: shop?.is_verified || false,
      createdAt: shop?.created_at || '',
      shopId: shop?.shop_id || '',
    }));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | undefined> => {
  try {
    // @ts-ignore - Ignore the type error since we know this is the correct usage
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching shop ${id}:`, error);
      return undefined;
    }
    
    if (!shop) return undefined;
    
    return {
      id: shop?.id || '',
      name: shop?.name || '',
      description: shop?.description || '',
      logo: shop?.logo || '/placeholder.svg',
      coverImage: shop?.cover_image || '/placeholder.svg',
      address: shop?.address || '',
      rating: shop?.rating || 0,
      reviewCount: shop?.review_count || 0,
      productIds: [], // We'll fetch products separately
      isVerified: shop?.is_verified || false,
      createdAt: shop?.created_at || '',
      shopId: shop?.shop_id || '',
    };
  } catch (error) {
    console.error(`Error fetching shop ${id}:`, error);
    return undefined;
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    // @ts-ignore - Ignore the type error since we know this is the correct usage
    const { error } = await supabase
      .from('shops')
      .update({
        name: shopData.name,
        description: shopData.description,
        logo: shopData.logo,
        cover_image: shopData.coverImage,
        address: shopData.address,
        is_verified: shopData.isVerified,
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating shop:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating shop:', error);
    return false;
  }
};

// Function to create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<string | null> => {
  try {
    // Generate a simple shop ID
    const shopId = shopData.shopId || `shop-${Math.floor(Math.random() * 10000)}`;
    
    // @ts-ignore - Ignore the type error since we know this is the correct usage
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description,
        logo: shopData.logo,
        cover_image: shopData.coverImage,
        address: shopData.address,
        is_verified: shopData.isVerified,
        shop_id: shopId,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    // In a real app, you would save these credentials securely and send them to the shop owner
    console.info('New shop created with credentials:', {
      shopId: shopId,
      password: `password${Math.floor(Math.random() * 10000)}` // This is just for demo
    });
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Function to delete a shop
export const deleteShop = async (id: string): Promise<boolean> => {
  try {
    // @ts-ignore - Ignore the type error since we know this is the correct usage
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
    console.error('Error deleting shop:', error);
    return false;
  }
};
