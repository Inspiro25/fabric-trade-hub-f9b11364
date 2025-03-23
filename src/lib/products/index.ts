
// Re-export all product related functionality
export * from '@/lib/types/product';
export * from '@/lib/products/base';
export { 
  getRelatedProducts,
  getNewArrivals,
  getProductsByCategory,
  getProductsByTags,
  // Rename the one from filters to avoid conflict
  getTrendingProducts as getBasicTrendingProducts
} from '@/lib/products/filters';
export * from '@/lib/products/categories';
export * from '@/lib/products/collections';
export * from '@/lib/products/deal';
export * from '@/lib/products/trending';

// Import necessary types and functionality
import { Product } from '@/lib/types/product';
import { supabase } from '@/integrations/supabase/client';

// Add this function to fetch a single product by ID
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    // If we're connected to Supabase, fetch from database
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    if (data) {
      // Map the database product to our Product type
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: data.price,
        salePrice: data.sale_price,
        rating: data.rating,
        reviewCount: data.review_count,
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        category: data.category_id || '',
        tags: data.tags || [],
        stock: data.stock || 0,
        shopId: data.shop_id,
        isNew: data.is_new || false,
        isTrending: data.is_trending || false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

// Add a specialized function to get the latest new arrivals
export const getLatestNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    // Get products marked as new, ordered by created_at date
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching latest new arrivals:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map database products to our Product type
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      salePrice: product.sale_price,
      images: product.images || [],
      category: product.category_id || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.is_new || false,
      isTrending: product.is_trending || false,
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      stock: product.stock || 0,
      tags: product.tags || [],
      shopId: product.shop_id || '',
    }));
  } catch (error) {
    console.error('Error in getLatestNewArrivals:', error);
    return [];
  }
};
