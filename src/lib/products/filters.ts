
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { normalizeProductData } from '@/lib/products/types';

export async function getFilteredProducts(type: 'trending' | 'new' | 'deals' | 'featured', limit = 8): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');

    switch (type) {
      case 'trending':
        // Get products marked as trending or with high review counts
        query = query
          .eq('is_trending', true)
          .order('review_count', { ascending: false })
          .limit(limit);
        break;

      case 'new':
        // Get products marked as new, ordered by creation date
        query = query
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(limit);
        break;

      case 'deals':
        // Get products with sale prices, ordered by discount percentage
        query = query
          .not('sale_price', 'is', null)
          .order('sale_price', { ascending: true })
          .limit(limit);
        break;

      case 'featured':
        // Get products with high ratings
        query = query
          .gt('rating', 4)
          .order('rating', { ascending: false })
          .limit(limit);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error in getFilteredProducts (${type}):`, error);
      // Return empty array instead of mock data
      return [];
    }
    
    return data?.map(normalizeProductData) || [];
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error);
    // Return empty array instead of mock data
    return [];
  }
}

export async function getProductsByCategory(categoryId: string, limit = 12): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .limit(limit);

    if (error) {
      console.error(`Error in getProductsByCategory:`, error);
      return [];
    }
    
    return data?.map(normalizeProductData) || [];
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
}
