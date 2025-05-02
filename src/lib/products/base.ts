
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/products/types';

// Fetch products by their IDs
export const getProductsByIds = async (productIds: string[]): Promise<Product[]> => {
  try {
    if (productIds.length === 0) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        shop:shop_id(name, logo)
      `)
      .in('id', productIds);
      
    if (error) {
      console.error('Error fetching products by IDs:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      sale_price: product.sale_price,
      images: product.images || [],
      category: product.category || '',
      category_id: product.category_id,
      categoryId: product.category_id,
      shop_id: product.shop_id,
      shopId: product.shop_id,
      shopName: product.shop?.name || '',
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      review_count: product.review_count || 0,
      stock: product.stock || 0,
      colors: product.colors || [],
      sizes: product.sizes || [],
      tags: product.tags || [],
      isNew: product.is_new,
      is_new: product.is_new,
      isTrending: product.is_trending,
      is_trending: product.is_trending,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  } catch (error) {
    console.error('Error in getProductsByIds:', error);
    return [];
  }
};

// Get a product by its ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // First, check if products table has views column
    const hasViewsColumn = await checkProductViewsColumn();
    
    // Basic query without views
    let query = `
      *,
      shop:shop_id(name, logo)
    `;
    
    const { data, error } = await supabase
      .from('products')
      .select(query)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Ensure we handle the case where data might be a string error
    if (typeof data === 'string') {
      console.error('Unexpected string data:', data);
      return null;
    }
    
    // Explicitly type cast the data to avoid TypeScript errors
    const product = data as any;
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      sale_price: product.sale_price,
      images: product.images || [],
      category: product.category || '',
      category_id: product.category_id,
      categoryId: product.category_id,
      shop_id: product.shop_id,
      shopId: product.shop_id,
      shopName: product.shop?.name || '',
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      review_count: product.review_count || 0,
      stock: product.stock || 0,
      colors: product.colors || [],
      sizes: product.sizes || [],
      tags: product.tags || [],
      isNew: product.is_new,
      is_new: product.is_new,
      isTrending: product.is_trending,
      is_trending: product.is_trending,
      created_at: product.created_at,
      updated_at: product.updated_at
    };
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

// Helper function to check if products table has views column
const checkProductViewsColumn = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .select('views')
      .limit(1);
    
    return !error; // If no error, views column exists
  } catch {
    return false; // If error, views column doesn't exist
  }
};

// Add a function to fetch products for Offers page
export const fetchProductsByIds = async (ids: string[]): Promise<Product[]> => {
  return getProductsByIds(ids);
};
