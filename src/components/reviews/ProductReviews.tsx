import React from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ProductReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
  helpful_count?: number;
  images?: string[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId,
  rating = 0,
  reviewCount = 0
}) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });
  
  // Calculate percentages
  const ratingPercentages = ratingCounts.map(count => 
    reviews.length > 0 ? (count / reviews.length) * 100 : 0
  );
  
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to include user information
      const transformedReviews = data.map((review: any) => ({
        ...review,
        user_name: review.profiles?.display_name || 'Anonymous',
        user_avatar: review.profiles?.avatar_url || null
      }));
      
      setReviews(transformedReviews);
      
      // Check if current user has already reviewed
      if (currentUser) {
        const hasReviewed = data.some((review: any) => review.user_id === currentUser.id);
        setHasUserReviewed(hasReviewed);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitReview = async () => {
    if (!currentUser) {
      toast.error('Please log in to submit a review');
      return;
    }
    
    if (!userReview.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: currentUser.id,
          rating: userRating,
          comment: userReview,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('Review submitted successfully');
      setUserReview('');
      setUserRating(5);
      setHasUserReviewed(true);
      
      // Refresh reviews
      fetchReviews();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleHelpful = async (reviewId: string) => {
    if (!currentUser) {
      toast.error('Please log in to mark reviews as helpful');
      return;
    }
    
    try {
      // Check if user has already marked this review as helpful
      const { data: existingVote, error: checkError } = await supabase
        .from('review_helpful_votes')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_id', currentUser.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingVote) {
        // Remove the vote
        const { error: deleteError } = await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) throw deleteError;
        
        // Update the UI
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: (review.helpful_count || 1) - 1 } 
            : review
        ));
        
        toast.info('Removed helpful vote');
      } else {
        // Add a new vote
        const { error: insertError } = await supabase
          .from('review_helpful_votes')
          .insert({
            review_id: reviewId,
            user_id: currentUser.id,
            created_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
        
        // Update the UI
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpful_count: (review.helpful_count || 0) + 1 } 
            : review
        ));
        
        toast.success('Marked as helpful');
      }
    } catch (error) {
      console.error('Error updating helpful status:', error);
      toast.error('Failed to update helpful status');
    }
  };
  
  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));
  
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Overall Rating */}
          <div className="text-center md:w-1/4">
            <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "h-5 w-5", 
                    star <= Math.round(rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {reviewCount} reviews
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((starCount, index) => (
              <div key={starCount} className="flex items-center mb-1">
                <div className="flex items-center w-16">
                  <span className="text-sm mr-1">{starCount}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${ratingPercentages[index]}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-xs text-gray-500 dark:text-gray-400">
                  {ratingCounts[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Write a Review */}
      {currentUser && !hasUserReviewed && (
        <div className="border rounded-lg p-4 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-3">Write a Review</h3>
          <div className="mb-4">
            <div className="text-sm mb-1">Rating</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="p-1"
                >
                  <Star 
                    className={cn(
                      "h-6 w-6 transition-colors", 
                      star <= userRating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-sm mb-1">Review</div>
            <Textarea
              placeholder="Share your experience with this product..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              rows={4}
            />
          </div>
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting || !userReview.trim()}
          >
            Submit Review
          </Button>
        </div>
      )}
      
      {/* Filter Reviews */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Reviews
        </Button>
        {[5, 4, 3, 2, 1].map((starCount) => (
          <Button
            key={starCount}
            variant={filter === starCount.toString() ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(starCount.toString())}
            className="flex items-center"
          >
            {starCount} <Star className="h-3 w-3 ml-1 fill-current" />
          </Button>
        ))}
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading reviews...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4 dark:border-gray-700">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user_avatar || ''} alt={review.user_name} />
                    <AvatarFallback>{review.user_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{review.user_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={cn(
                        "h-4 w-4", 
                        star <= review.rating 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-3 text-gray-700 dark:text-gray-300">
                {review.comment}
              </div>
              
              {/* Review images if any */}
              {review.images && review.images.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {review.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Review image ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleHelpful(review.id)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful {review.helpful_count ? `(${review.helpful_count})` : ''}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No reviews yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination - can be added if needed */}
    </div>
  );
};

export default ProductReviews;
