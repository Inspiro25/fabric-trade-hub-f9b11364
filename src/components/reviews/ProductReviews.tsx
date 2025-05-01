
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { StarIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDate } from '@/lib/utils';

export interface ProductReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating = 0, reviewCount = 0 }) => {
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      // Fetch reviews from the backend
      // This is a placeholder - replace with actual API call
      setTimeout(() => {
        const demoReviews = [
          {
            id: '1',
            user_id: 'user1',
            user_name: 'Jane Doe',
            avatar: '',
            rating: 5,
            comment: 'Great product! Very satisfied with my purchase.',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
          },
          {
            id: '2',
            user_id: 'user2',
            user_name: 'John Smith',
            avatar: '',
            rating: 4,
            comment: 'Good quality but shipping took longer than expected.',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
          }
        ];
        setReviews(demoReviews);
        setLoadingReviews(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load product reviews');
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to submit a review');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Submit review to the backend
      // This is a placeholder - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your review has been submitted successfully');
      setComment('');
      setUserRating(5);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <span className="text-3xl font-bold">{rating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">/ 5</span>
        </div>
        <div className="flex items-center">
          {renderStars(Math.round(rating))}
        </div>
        <span className="text-gray-500">({reviewCount} reviews)</span>
      </div>

      {currentUser && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1"
                    >
                      <StarIcon className={`h-6 w-6 ${star <= userRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Customer Reviews</h3>
        
        {loadingReviews ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <Card key={review.id} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar || ''} alt={review.user_name} />
                    <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{review.user_name}</h4>
                      <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    <div className="flex my-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  Helpful
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
