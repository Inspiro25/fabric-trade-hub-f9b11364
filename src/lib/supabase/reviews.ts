
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  productId?: string;
  shopId?: string;
  userId: string;
  helpfulCount: number;
  reviewType: 'product' | 'shop';
  userName?: string;
}

// Fetch reviews for a product
export const fetchProductReviews = async (productId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        rating,
        comment,
        images,
        created_at,
        updated_at,
        product_id,
        user_id,
        helpful_count,
        review_type
      `)
      .eq('product_id', productId)
      .eq('review_type', 'product')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }

    return (data || []).map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      images: review.images || [],
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      productId: review.product_id,
      userId: review.user_id,
      helpfulCount: review.helpful_count,
      reviewType: review.review_type as 'product' | 'shop'
    }));
  } catch (error) {
    console.error('Error in fetchProductReviews:', error);
    return [];
  }
};

// Fetch reviews for a shop
export const fetchShopReviews = async (shopId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        rating,
        comment,
        images,
        created_at,
        updated_at,
        shop_id,
        user_id,
        helpful_count,
        review_type
      `)
      .eq('shop_id', shopId)
      .eq('review_type', 'shop')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shop reviews:', error);
      return [];
    }

    return (data || []).map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      images: review.images || [],
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      shopId: review.shop_id,
      userId: review.user_id,
      helpfulCount: review.helpful_count,
      reviewType: review.review_type as 'product' | 'shop'
    }));
  } catch (error) {
    console.error('Error in fetchShopReviews:', error);
    return [];
  }
};

// Create a new review (works for both product and shop)
export const createReview = async (
  reviewData: {
    rating: number;
    comment: string;
    images?: string[];
    userId: string;
    reviewType: 'product' | 'shop';
    productId?: string;
    shopId?: string;
  }
): Promise<Review | null> => {
  try {
    // Validate that at least one ID is provided based on review type
    if (reviewData.reviewType === 'product' && !reviewData.productId) {
      throw new Error('Product ID is required for product reviews');
    }
    if (reviewData.reviewType === 'shop' && !reviewData.shopId) {
      throw new Error('Shop ID is required for shop reviews');
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images || [],
        user_id: reviewData.userId,
        product_id: reviewData.productId,
        shop_id: reviewData.shopId,
        review_type: reviewData.reviewType,
        helpful_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      toast({
        title: 'Failed to submit review',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }

    // Update the product or shop rating based on the review type
    if (reviewData.reviewType === 'product' && reviewData.productId) {
      await updateProductRating(reviewData.productId);
    } else if (reviewData.reviewType === 'shop' && reviewData.shopId) {
      await updateShopRating(reviewData.shopId);
    }

    toast({
      title: 'Review submitted',
      description: 'Thank you for your feedback!'
    });

    return {
      id: data.id,
      rating: data.rating,
      comment: data.comment || '',
      images: data.images || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      productId: data.product_id,
      shopId: data.shop_id,
      userId: data.user_id,
      helpfulCount: data.helpful_count,
      reviewType: data.review_type as 'product' | 'shop'
    };
  } catch (error) {
    console.error('Error in createReview:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    toast({
      title: 'Failed to submit review',
      description: errorMessage,
      variant: 'destructive'
    });
    return null;
  }
};

// Mark a review as helpful
export const markReviewAsHelpful = async (reviewId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (error) {
      console.error('Error fetching review helpful count:', error);
      return false;
    }

    const { error: updateError } = await supabase
      .from('product_reviews')
      .update({ helpful_count: (data.helpful_count || 0) + 1 })
      .eq('id', reviewId);

    if (updateError) {
      console.error('Error updating review helpful count:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markReviewAsHelpful:', error);
    return false;
  }
};

// Helper function to update product rating
const updateProductRating = async (productId: string): Promise<void> => {
  try {
    // Get all reviews for this product
    const { data, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('review_type', 'product');

    if (error) {
      console.error('Error fetching product reviews for rating update:', error);
      return;
    }

    if (!data || data.length === 0) return;

    // Calculate average rating
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;

    // Update product rating and review count
    await supabase
      .from('products')
      .update({
        rating: averageRating,
        review_count: data.length
      })
      .eq('id', productId);
  } catch (error) {
    console.error('Error in updateProductRating:', error);
  }
};

// Helper function to update shop rating
const updateShopRating = async (shopId: string): Promise<void> => {
  try {
    // Get all reviews for this shop
    const { data, error } = await supabase
      .from('product_reviews')
      .select('rating')
      .eq('shop_id', shopId)
      .eq('review_type', 'shop');

    if (error) {
      console.error('Error fetching shop reviews for rating update:', error);
      return;
    }

    if (!data || data.length === 0) return;

    // Calculate average rating
    const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / data.length;

    // Update shop rating and review count
    await supabase
      .from('shops')
      .update({
        rating: averageRating,
        review_count: data.length
      })
      .eq('id', shopId);
  } catch (error) {
    console.error('Error in updateShopRating:', error);
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    // First get the review to determine what type it is
    const { data: review, error: fetchError } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('id', reviewId)
      .single();

    if (fetchError) {
      console.error('Error fetching review for deletion:', fetchError);
      return false;
    }

    // Delete the review
    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }

    // Update ratings based on review type
    if (review.review_type === 'product' && review.product_id) {
      await updateProductRating(review.product_id);
    } else if (review.review_type === 'shop' && review.shop_id) {
      await updateShopRating(review.shop_id);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteReview:', error);
    return false;
  }
};
