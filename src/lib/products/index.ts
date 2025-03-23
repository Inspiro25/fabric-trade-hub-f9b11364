
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
        description: data.description,
        price: data.price,
        salePrice: data.sale_price,
        rating: data.rating,
        reviewCount: data.review_count,
        images: data.images || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        category: data.category,
        tags: data.tags || [],
        stock: data.stock,
        shopId: data.shop_id,
        isNew: data.is_new,
        isFeatured: data.is_featured,
        createdAt: data.created_at,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};
