
import { supabase } from '@/integrations/supabase/client';
import { Product } from './types';
import { normalizeProductData } from '@/lib/products/types';
import { mockProducts } from './index';

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
      // Return mock data as fallback in case of database error
      return getMockProductsByType(type, limit);
    }
    
    return data?.map(normalizeProductData) || getMockProductsByType(type, limit);
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error);
    // Fallback to mock data
    return getMockProductsByType(type, limit);
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
      return getMockProductsByCategory(limit);
    }
    
    return data?.map(normalizeProductData) || getMockProductsByCategory(limit);
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return getMockProductsByCategory(limit);
  }
}

// Mock data functions as fallback
function getMockProductsByType(type: 'trending' | 'new' | 'deals' | 'featured', limit: number): Product[] {
  let filteredProducts: Product[] = [];
  
  switch (type) {
    case 'trending':
      filteredProducts = mockProducts.filter(p => p.isTrending);
      break;
    case 'new':
      filteredProducts = mockProducts.filter(p => p.isNew);
      break;
    case 'deals':
      filteredProducts = mockProducts.filter(p => p.salePrice !== null);
      break;
    case 'featured':
      filteredProducts = mockProducts.filter(p => p.rating >= 4);
      break;
  }
  
  return filteredProducts.slice(0, limit);
}

function getMockProductsByCategory(limit: number): Product[] {
  return mockProducts.slice(0, limit);
}
