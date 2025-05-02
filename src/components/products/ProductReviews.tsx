
import React from 'react';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  rating?: number;
  reviewCount?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, rating = 0, reviewCount = 0 }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-5 w-5 ${star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">Based on {reviewCount} reviews</span>
      </div>
      
      <div className="border rounded-md p-4">
        <p className="text-center text-gray-500">
          {reviewCount > 0 
            ? "Reviews are currently being loaded..."
            : "No reviews yet. Be the first to review this product!"
          }
        </p>
      </div>
    </div>
  );
};

export default ProductReviews;
