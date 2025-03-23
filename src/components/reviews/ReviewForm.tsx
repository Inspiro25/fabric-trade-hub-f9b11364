
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload } from 'lucide-react';
import { createReview } from '@/lib/supabase/reviews';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from '@/components/search/AuthDialog';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser: user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Check Supabase authentication status on component mount and on auth state changes
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseUserId(session?.user?.id || null);
      console.log("Current Supabase session user ID:", session?.user?.id);
    };
    
    checkSession();
    
    // Set up auth state listener for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUserId(session?.user?.id || null);
      console.log("Auth state changed, user ID:", session?.user?.id);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First check if user is logged in with Supabase
    if (!supabaseUserId) {
      console.log("No Supabase user ID found, opening auth dialog");
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
      
      console.log("Submitting review with Supabase user ID:", supabaseUserId);
      
      // Use Supabase user ID directly
      const result = await createReview({
        rating,
        comment,
        userId: supabaseUserId,
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
    // Force a check for the updated session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSupabaseUserId(session.user.id);
        console.log("User logged in, session ID:", session.user.id);
        toast({
          title: 'Logged in successfully',
          description: 'You can now submit your review.',
        });
      }
    });
  };

  return (
    <div className={cn(
      "rounded-lg shadow-sm p-4 mb-4",
      isDarkMode 
        ? "bg-gray-800 border border-gray-700" 
        : "bg-white"
    )}>
      <h3 className={cn(
        "text-sm font-medium mb-3",
        isDarkMode && "text-gray-200"
      )}>Write a Review</h3>
      
      {supabaseUserId ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className={cn(
              "text-xs mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>Select your rating:</p>
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
                      star <= rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className={cn(
                "text-xs ml-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Tap to rate'}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <Textarea
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={cn(
                "w-full resize-none text-sm",
                isDarkMode && "bg-gray-700 border-gray-600 text-gray-200"
              )}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className={cn(
                "text-xs",
                isDarkMode 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "bg-kutuku-primary hover:bg-kutuku-secondary"
              )}
              size="sm"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className={cn(
            "text-sm mb-3", 
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            You need to be logged in to submit a review
          </p>
          <Button 
            onClick={() => setIsAuthDialogOpen(true)}
            className={cn(
              "text-xs",
              isDarkMode 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "bg-kutuku-primary hover:bg-kutuku-secondary"
            )}
            size="sm"
          >
            Log In to Review
          </Button>
        </div>
      )}

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default ReviewForm;
