import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';

// Record product view
export const recordProductView = async (userId: string | undefined, productId: string): Promise<void> => {
  if (!userId) return;
  
  try {
    // Check if product view already exists
    const { data: existingView, error: checkError } = await supabase
      .from('product_view_history')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking product view:', checkError);
      return;
    }
    
    if (existingView) {
      // Update existing view
      const { error: updateError } = await supabase
        .from('product_view_history')
        .update({
          view_count: existingView.view_count + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', existingView.id);
      
      if (updateError) {
        console.error('Error updating product view:', updateError);
      }
    } else {
      // Create new view
      const { error: insertError } = await supabase
        .from('product_view_history')
        .insert({
          user_id: userId,
          product_id: productId,
          view_count: 1
        });
      
      if (insertError) {
        console.error('Error recording product view:', insertError);
      }
    }
  } catch (error) {
    console.error('Error recording product view:', error);
  }
};

// Get personalized recommendations based on view history
export const getPersonalizedRecommendations = async (userId: string, limit = 10): Promise<Product[]> => {
  if (!userId) return [];
  
  try {
    // Get top viewed categories
    const { data: viewHistory, error: viewError } = await supabase
      .from('product_view_history')
      .select('product_id, view_count, products:products(category_id)')
      .eq('user_id', userId)
      .order('view_count', { ascending: false })
      .limit(20);
    
    if (viewError) {
      console.error('Error fetching view history:', viewError);
      return [];
    }
    
    // Extract categories and count occurrences
    const categoryCount: Record<string, number> = {};
    viewHistory.forEach(item => {
      const categoryId = (item.products as any)?.category_id;
      if (categoryId) {
        categoryCount[categoryId] = (categoryCount[categoryId] || 0) + item.view_count;
      }
    });
    
    // Sort categories by view count
    const sortedCategories = Object.entries(categoryCount)
      .sort(([_, countA], [__, countB]) => countB - countA)
      .map(([category]) => category)
      .slice(0, 3); // Top 3 categories
    
    // Get viewed product IDs to exclude them
    const viewedProductIds = viewHistory.map(item => item.product_id);
    
    // Fetch recommended products from top categories that user hasn't viewed
    const { data: recommendedProducts, error: recError } = await supabase
      .from('products')
      .select('*')
      .in('category_id', sortedCategories)
      .not('id', 'in', `(${viewedProductIds.join(',')})`)
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (recError) {
      console.error('Error fetching recommended products:', recError);
      return [];
    }
    
    // Transform to Product format
    return recommendedProducts.map(product => ({
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
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

// Get similar products based on a product's category and tags
export const getSimilarProducts = async (productId: string, limit = 6): Promise<Product[]> => {
  try {
    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) {
      console.error('Error fetching product:', productError);
      return [];
    }
    
    // Get similar products based on category and tags
    const { data: similarProducts, error: similarError } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', productId)
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (similarError) {
      console.error('Error fetching similar products:', similarError);
      return [];
    }
    
    // Transform to Product format
    return similarProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      salePrice: p.sale_price,
      images: p.images || [],
      category: p.category_id || '',
      colors: p.colors || [],
      sizes: p.sizes || [],
      isNew: p.is_new || false,
      isTrending: p.is_trending || false,
      rating: p.rating || 0,
      reviewCount: p.review_count || 0,
      stock: p.stock || 0,
      tags: p.tags || [],
      shopId: p.shop_id || '',
    }));
  } catch (error) {
    console.error('Error getting similar products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string, limit = 4): Promise<Product[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category)
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    
    // Transform to Product format
    return products.map(product => ({
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
    console.error('Error getting products by category:', error);
    return [];
  }
};
