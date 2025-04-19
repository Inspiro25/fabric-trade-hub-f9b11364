
import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { Review, fetchProductReviews, fetchShopReviews, markReviewAsHelpful } from '@/lib/supabase/reviews';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
  const { isDarkMode } = useTheme();

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
        <div className={cn(
          "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2",
          isDarkMode ? "border-blue-500" : "border-kutuku-primary"
        )}></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedReviews.map((review) => (
        <div key={review.id} className={cn(
          "border rounded-lg p-3 shadow-sm",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-100"
        )}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )}>
                <User className={cn(
                  "h-4 w-4",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )} />
              </div>
              <div className="ml-2">
                <p className={cn(
                  "text-xs font-medium",
                  isDarkMode && "text-gray-200"
                )}>
                  {review.userName || 'Anonymous User'}
                </p>
                <div className="flex items-center mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < review.rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={cn(
              "flex items-center text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {review.comment && (
            <div className="mt-2">
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-gray-300" : "text-gray-700",
                expandedReviews.includes(review.id) ? '' : 'line-clamp-3'
              )}>
                {review.comment}
              </p>
              
              {review.comment.length > 150 && (
                <button 
                  onClick={() => toggleExpandReview(review.id)} 
                  className={cn(
                    "text-xs hover:underline mt-1",
                    isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                  )}
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
              className={cn(
                "h-7 text-xs px-2",
                isDarkMode 
                  ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700" 
                  : "text-gray-500 hover:text-kutuku-primary"
              )}
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
            className={cn(
              "text-xs",
              isDarkMode && "border-gray-700 text-gray-300 hover:bg-gray-700"
            )}
          >
            View all {reviews.length} reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
