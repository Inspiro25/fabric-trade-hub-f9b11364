import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const fetchProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        shop:shops!inner(
          id,
          name,
          logo
        )
      `)
      .eq('stock', '>', 0)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      images: product.images || [],
      category: product.category_id,
      shop: {
        id: product.shop.id,
        name: product.shop.name,
        logo: product.shop.logo
      },
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.is_new,
      isTrending: product.is_trending,
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      stock: product.stock || 0
    })) || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    return [];
  }
};