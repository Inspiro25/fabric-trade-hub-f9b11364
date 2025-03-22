
import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { Review, fetchProductReviews, fetchShopReviews, markReviewAsHelpful } from '@/lib/supabase/reviews';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ReviewListProps {
  productId?: string;
  shopId?: string;
  maxShown?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId, shopId, maxShown }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        let loadedReviews: Review[] = [];
        
        if (productId) {
          loadedReviews = await fetchProductReviews(productId);
        } else if (shopId) {
          loadedReviews = await fetchShopReviews(shopId);
        }
        
        setReviews(loadedReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId, shopId]);

  const handleMarkHelpful = async (reviewId: string) => {
    const success = await markReviewAsHelpful(reviewId);
    
    if (success) {
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: review.helpfulCount + 1 } 
            : review
        )
      );
      
      toast({
        title: "Marked as helpful",
        description: "Thank you for your feedback!"
      });
    }
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    );
  };

  const displayedReviews = showAll || !maxShown 
    ? reviews 
    : reviews.slice(0, maxShown);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kutuku-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedReviews.map((review) => (
        <div key={review.id} className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium">Anonymous User</p>
                <div className="flex items-center mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {review.comment && (
            <div className="mt-2">
              <p className={`text-xs text-gray-700 ${
                expandedReviews.includes(review.id) ? '' : 'line-clamp-3'
              }`}>
                {review.comment}
              </p>
              
              {review.comment.length > 150 && (
                <button 
                  onClick={() => toggleExpandReview(review.id)} 
                  className="text-xs text-kutuku-primary hover:underline mt-1"
                >
                  {expandedReviews.includes(review.id) ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs px-2 text-gray-500 hover:text-kutuku-primary"
              onClick={() => handleMarkHelpful(review.id)}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful ({review.helpfulCount})
            </Button>
          </div>
        </div>
      ))}
      
      {maxShown && reviews.length > maxShown && !showAll && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAll(true)}
            className="text-xs"
          >
            View all {reviews.length} reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
