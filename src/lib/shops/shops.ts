import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/types/shop';

export const fetchShops = async () => {
  try {
    // First, verify the tables exist
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    console.log('Available tables:', tables);

    // Then fetch shops with modified query
    const { data: shops, error } = await supabase
      .from('store')  // Try 'store' instead of 'shops' if that's your table name
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
        product:product(count)  // Try 'product' instead of 'products' if that's your table name
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
      description: shop.description,
      logo: shop.logo || '/placeholder.svg',
      coverImage: shop.cover_image || '/placeholder.svg',
      address: shop.address || '',
      rating: shop.rating || 0,
      reviewCount: shop.review_count || 0,
      followers: shop.followers_count || 0,
      isVerified: shop.is_verified || false,
      productsCount: shop.product?.[0]?.count || 0,
      status: shop.status || 'pending'
    }));

  } catch (error) {
    console.error('Error in fetchShops:', error);
    throw error;
  }
};