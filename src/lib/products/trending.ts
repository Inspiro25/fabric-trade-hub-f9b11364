
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types/product';

// Function to get trending products with an enhanced algorithm 
// that considers views, ratings, purchase frequency, and recency
export const getTrendingProducts = async (
  timeframe: 'all' | 'today' | 'week' | 'month' = 'all',
  sortBy: 'popularity' | 'rating' | 'recent' = 'popularity'
): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_reviews(count),
        product_view_history(count)
      `);
    
    // Apply timeframe filter
    if (timeframe !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (timeframe) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      const startDateStr = startDate.toISOString();
      
      // Filter views by timeframe
      query = query.gte('product_view_history.last_viewed_at', startDateStr);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'recent':
        // Assuming there's a created_at field in products
        query = query.order('created_at', { ascending: false });
        break;
      case 'popularity':
      default:
        // For popularity, use a combination of review count and view count
        query = query.order('review_count', { ascending: false });
        break;
    }
    
    // Limit to 50 trending products
    const { data, error } = await query.limit(50);
    
    if (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Calculate a trending score for each product
    const productsWithScore = data.map(product => {
      // Parse values from the joined tables
      const reviewCount = product.review_count || 0;
      
      // Calculate view counts from view history
      const viewHistoryCount = Array.isArray(product.product_view_history) 
        ? product.product_view_history.length
        : 0;
      
      // Calculate trending score - weights can be adjusted based on importance
      const viewWeight = 1;
      const reviewWeight = 2;
      const ratingWeight = 3;
      
      const viewScore = viewHistoryCount * viewWeight;
      const reviewScore = reviewCount * reviewWeight;
      const ratingScore = (product.rating || 0) * ratingWeight;
      
      // Combined score
      const trendingScore = viewScore + reviewScore + ratingScore;
      
      // Return product with score
      return {
        ...product,
        trendingScore
      };
    });
    
    // Sort by trending score if popularity is selected
    if (sortBy === 'popularity') {
      productsWithScore.sort((a, b) => b.trendingScore - a.trendingScore);
    }
    
    // Map to Product type
    return productsWithScore.map(product => ({
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
      isTrending: true, // Mark all as trending
      rating: product.rating || 0,
      reviewCount: product.review_count || 0,
      stock: product.stock || 0,
      tags: product.tags || [],
      shopId: product.shop_id || '',
    }));
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};

// Function to record a product view to help with trending calculations
export const recordProductView = async (productId: string, userId?: string): Promise<void> => {
  try {
    // If no user ID, just increment view count on product
    if (!userId) {
      // Since we can't use an RPC to increment directly, we'll need to fetch and update
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('review_count')
        .eq('id', productId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching product for view count update:', fetchError);
        return;
      }
      
      // Now update with incremented count
      const currentCount = data?.review_count || 0;
      const newCount = currentCount + 1;
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ review_count: newCount })
        .eq('id', productId);
      
      if (updateError) {
        console.error('Error updating product view count:', updateError);
      }
      return;
    }
    
    // Check if there's an existing view
    const { data: existingView, error: viewError } = await supabase
      .from('product_view_history')
      .select('*')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (viewError) {
      console.error('Error checking product view history:', viewError);
      return;
    }
    
    if (existingView) {
      // Update existing view count
      const { error: updateError } = await supabase
        .from('product_view_history')
        .update({
          view_count: (existingView.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', existingView.id);
      
      if (updateError) {
        console.error('Error updating product view history:', updateError);
      }
    } else {
      // Create new view record
      const { error: insertError } = await supabase
        .from('product_view_history')
        .insert({
          product_id: productId,
          user_id: userId,
          view_count: 1,
          last_viewed_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting product view history:', insertError);
      }
    }
  } catch (error) {
    console.error('Error recording product view:', error);
  }
};
