
import { supabase } from "@/integrations/supabase/client";
import { Shop } from "@/lib/shops/types";

// Function to fetch all shops from Supabase
export const fetchShops = async (): Promise<Shop[]> => {
  try {
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
      ownerName: shop?.owner_name || '',
      ownerEmail: shop?.owner_email || '',
      phoneNumber: shop?.phone_number || '', 
      rating: shop?.rating || 0,
      reviewCount: shop?.review_count || 0,
      followers: shop?.followers_count || 0,
      productIds: [], // We'll fetch products separately
      isVerified: shop?.is_verified || false,
      status: (shop?.status as 'active' | 'pending' | 'suspended') || 'pending',
      createdAt: shop?.created_at || '',
      shopId: shop?.shop_id || '',
      password: shop?.password || '', 
      followers_count: shop?.followers_count || 0, 
    }));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Function to get a shop by ID
export const getShopById = async (id: string): Promise<Shop | undefined> => {
  try {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
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
      ownerName: shop?.owner_name || '',
      ownerEmail: shop?.owner_email || '',
      phoneNumber: '', // Use empty string as fallback since phone_number doesn't exist in the DB
      rating: shop?.rating || 0,
      reviewCount: shop?.review_count || 0,
      followers: shop?.followers_count || 0,
      productIds: [], // We'll fetch products separately
      isVerified: shop?.is_verified || false,
      status: (shop?.status as 'active' | 'pending' | 'suspended') || 'pending',
      createdAt: shop?.created_at || '',
      shopId: shop?.shop_id || '',
      password: shop?.password || '', 
      followers_count: shop?.followers_count || 0, 
    };
  } catch (error) {
    console.error(`Error fetching shop ${id}:`, error);
    return undefined;
  }
};

// Function to update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<boolean> => {
  try {
    const updateData: any = {
      name: shopData.name,
      description: shopData.description,
      logo: shopData.logo,
      cover_image: shopData.coverImage,
      address: shopData.address,
      is_verified: shopData.isVerified,
      owner_name: shopData.ownerName,
      owner_email: shopData.ownerEmail,
      status: shopData.status,
      shop_id: shopData.shopId,
      phone_number: shopData.phoneNumber, // Include phone_number in the update
    };

    // Only include password in the update if it was provided
    if (shopData.password) {
      updateData.password = shopData.password;
    }
    
    const { error } = await supabase
      .from('shops')
      .update(updateData)
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
    const shopIdValue = shopData.shopId || `shop-${Math.floor(Math.random() * 10000)}`;
    
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description,
        logo: shopData.logo,
        cover_image: shopData.coverImage,
        address: shopData.address,
        is_verified: shopData.isVerified,
        shop_id: shopIdValue,
        owner_name: shopData.ownerName,
        owner_email: shopData.ownerEmail,
        status: shopData.status || 'pending',
        password: shopData.password,
        phone_number: shopData.phoneNumber || '', // Include an empty string as default
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }
    
    return data?.id || null;
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

// Function to get shop data
export const getShopData = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single();

  if (error) {
    console.error('Error fetching shop:', error);
    throw new Error('Failed to fetch shop data');
  }

  // Transform the shop data to match our frontend data structure
  const transformedShop = {
    id: data.id,
    name: data.name,
    description: data.description,
    logo: data.logo,
    coverImage: data.cover_image,
    address: data.address,
    isVerified: data.is_verified,
    followersCount: data.followers_count,
    reviewCount: data.review_count,
    rating: data.rating,
    status: data.status,
    ownerName: data.owner_name,
    ownerEmail: data.owner_email,
    phoneNumber: '', // Use empty string as fallback since phone_number doesn't exist in the DB
    createdAt: data.created_at
  };

  return transformedShop;
};
