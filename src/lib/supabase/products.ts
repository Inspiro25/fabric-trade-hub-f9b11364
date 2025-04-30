
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';

export async function getProductById(id: string): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Product not found');

    // Map the data to the Product type
    const product: Product = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      salePrice: data.sale_price,
      sale_price: data.sale_price,
      images: data.images || [],
      category: data.category_id || '',
      category_id: data.category_id,
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      review_count: data.review_count || 0,
      stock: data.stock || 0,
      colors: data.colors || [],
      sizes: data.sizes || [],
      tags: data.tags || [],
      isNew: data.is_new || false,
      is_new: data.is_new || false,
      isTrending: data.is_trending || false,
      is_trending: data.is_trending || false,
      created_at: data.created_at
    };

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getShopProducts(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) throw error;

    // Map the data to the Product type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      salePrice: item.sale_price,
      sale_price: item.sale_price,
      images: item.images || [],
      category: item.category_id || '',
      category_id: item.category_id,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      review_count: item.review_count || 0,
      stock: item.stock || 0,
      colors: item.colors || [],
      sizes: item.sizes || [],
      tags: item.tags || [],
      isNew: item.is_new || false,
      is_new: item.is_new || false,
      isTrending: item.is_trending || false,
      is_trending: item.is_trending || false,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}
