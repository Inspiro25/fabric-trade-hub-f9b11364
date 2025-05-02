
import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId,
  rating = 0,
  reviewCount = 0
}) => {
  const [reviews] = useState([]);
  
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
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          <div>Reviews would display here</div>
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
    </div>
  );
};

export default ProductReviews;
