
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload } from 'lucide-react';
import { createReview } from '@/lib/supabase/reviews';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from '@/components/search/AuthDialog';

interface ReviewFormProps {
  productId?: string;
  shopId?: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, shopId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser: user } = useAuth();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting your review.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!productId && !shopId) {
        throw new Error('Either productId or shopId must be provided');
      }

      const reviewType = productId ? 'product' : 'shop';

      const result = await createReview({
        rating,
        comment,
        userId: user.id,
        reviewType,
        productId,
        shopId,
      });

      if (result) {
        setRating(0);
        setComment('');
        onReviewSubmitted();
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback!',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Failed to submit review',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    setIsAuthDialogOpen(false);
    // We'll refresh the page after login to get the latest user state
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-sm font-medium mb-3">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Select your rating:</p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="mr-1 focus:outline-none"
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-gray-500 ml-2">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Tap to rate'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <Textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full resize-none text-sm"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="bg-kutuku-primary hover:bg-kutuku-secondary text-xs"
            size="sm"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>

      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default ReviewForm;
