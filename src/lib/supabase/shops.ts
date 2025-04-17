import { supabase } from "@/integrations/supabase/client";
import { Shop } from "@/lib/shops/types";

interface ShopRow {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  address: string | null;
  owner_name: string | null;
  owner_email: string | null;
  phone_number: string | null;
  rating: number | null;
  review_count: number | null;
  followers_count: number | null;
  product_ids: string[] | null;
  is_verified: boolean | null;
  status: string | null;
  created_at: string | null;
  shop_id: string | null;
  updated_at: string | null;
}

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
      phoneNumber: shop?.phone_number || '', // Using the new column with a default value
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
export const updateShop = async (shopId: string, data: Partial<Shop>): Promise<boolean> => {
  try {
    console.log('Updating shop in database:', {
      shopId,
      data
    });

    // Only include fields that are actually being updated
    const updatePayload: Record<string, any> = {};
    
    if (data.name) updatePayload.name = data.name;
    if (data.description) updatePayload.description = data.description;
    if (data.logo) updatePayload.logo = data.logo;
    if (data.coverImage) updatePayload.cover_image = data.coverImage;
    if (data.address) updatePayload.address = data.address;
    if (data.ownerName) updatePayload.owner_name = data.ownerName;
    if (data.ownerEmail) updatePayload.owner_email = data.ownerEmail;
    if (data.phoneNumber) updatePayload.phone_number = data.phoneNumber;
    if (data.status) updatePayload.status = data.status;
    if (data.isVerified !== undefined) updatePayload.is_verified = data.isVerified;

    console.log('Update payload:', updatePayload);

    const { error } = await supabase
      .from('shops')
      .update(updatePayload)
      .eq('id', shopId);

    if (error) {
      console.error('Supabase error updating shop:', error);
      return false;
    }

    console.log('Shop updated successfully');
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
        phone_number: shopData.phoneNumber || '', // Include phone_number in the insert
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
    phoneNumber: data.phone_number || '', // Add the phone_number with a default
    createdAt: data.created_at
  };

  return transformedShop;
};

export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');

    if (error) throw error;

    return (data as ShopRow[]).map((shop): Shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      logo: shop.logo || '/placeholder.svg',
      coverImage: shop.cover_image || '/placeholder.svg',
      address: shop.address || '',
      ownerName: shop.owner_name || '',
      ownerEmail: shop.owner_email || '',
      phoneNumber: shop.phone_number || '',
      rating: shop.rating || 0,
      reviewCount: shop.review_count || 0,
      followers: shop.followers_count || 0,
      followers_count: shop.followers_count || 0,
      productIds: shop.product_ids || [],
      isVerified: shop.is_verified || false,
      status: (shop.status === 'suspended' ? 'inactive' : (shop.status || 'pending')) as 'active' | 'inactive' | 'pending',
      createdAt: shop.created_at || '',
      shopId: shop.shop_id || '',
      updated_at: shop.updated_at || shop.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export const updateShopStatus = async (shopId: string, status: 'active' | 'inactive' | 'pending'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('shops')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', shopId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating shop status:', error);
    throw error;
  }
};
