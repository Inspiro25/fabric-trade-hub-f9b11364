import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/lib/shops/types';

export const fetchShops = async () => {
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
        shop_id
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shops:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return [];
    }

    console.log('Raw shop data:', shops);

    if (!shops || shops.length === 0) {
      console.log('No shops found in the database');
      return [];
    }

    return shops.map(shop => ({
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
      isVerified: shop.is_verified || false,
      status: shop.status || 'pending',
      createdAt: shop.created_at || '',
      shopId: shop.shop_id || '',
      productIds: []
    }));
  } catch (error) {
    console.error('Error in fetchShops:', error);
    return [];
  }
};