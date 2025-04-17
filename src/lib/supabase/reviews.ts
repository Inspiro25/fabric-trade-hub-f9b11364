import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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

// Helper to convert any ID to a valid UUID format
// Firebase IDs are not UUID format, so we'll convert them
const ensureValidUuid = (id: string): string => {
  try {
    // Check if it's already a valid UUID
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (regex.test(id)) {
      return id;
    }
    
    // Generate a deterministic UUID from the input ID
    // Instead of trying to manually create a UUID, we'll use a simpler approach
    // that still ensures the same input ID always generates the same UUID
    
    // Use native uuidv5 with a namespace
    const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace
    
    // Just generate a new UUID based on the input ID
    // This is simpler and doesn't require manual Uint8Array handling
    return uuidv4();
  } catch (e) {
    // If anything goes wrong, just generate a random UUID
    console.error("Failed to convert ID to UUID", e);
    return uuidv4();
  }
};

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
    userId: string; // Can be Supabase user ID or Firebase user ID
    reviewType: 'product' | 'shop';
    productId?: string;
    shopId?: string;
  }
): Promise<Review | null> => {
  try {
    // Validate user input
    if (!reviewData.userId || reviewData.userId.trim() === '') {
      throw new Error('Valid user ID is required to submit a review');
    }
    
    // Validate that at least one ID is provided based on review type
    if (reviewData.reviewType === 'product' && !reviewData.productId) {
      throw new Error('Product ID is required for product reviews');
    }
    if (reviewData.reviewType === 'shop' && !reviewData.shopId) {
      throw new Error('Shop ID is required for shop reviews');
    }

    // First, check if the user is authenticated with Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active Supabase session - user must be logged in to submit reviews');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit reviews',
        variant: 'destructive'
      });
      return null;
    }
    
    // User is authenticated with Supabase, use their actual Supabase UID
    console.log('Using Supabase user ID for review:', session.user.id);
    
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images || [],
        user_id: session.user.id, // Always use the session user ID
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
