
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { Button } from '@/components/ui/button';

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating, reviewCount }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="border-t border-border pt-8">
      <h2 className="heading-md mb-6">Customer Reviews</h2>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex items-center mr-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${
                  i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                }`} 
              />
            ))}
            {rating % 1 > 0 && (
              <div className="relative">
                <Star className="h-5 w-5 text-gray-300" />
                <div 
                  className="absolute top-0 left-0 overflow-hidden" 
                  style={{ width: `${(rating % 1) * 100}%` }}
                >
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({reviewCount} reviews)</span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          variant={showReviewForm ? "secondary" : "default"}
          size="sm"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>
      
      {showReviewForm && (
        <div className="mb-8">
          <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      )}
      
      <div key={refreshKey} className="space-y-4">
        <ReviewList productId={productId} maxShown={5} />
      </div>
    </div>
  );
};

export default ProductReviews;
