
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useAuth } from '@/hooks/useAuth';

interface ShopReviewsTabProps {
  shopId: string;
}

const ShopReviewsTab: React.FC<ShopReviewsTabProps> = ({ shopId }) => {
  const { currentUser: user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    // Trigger reload of reviews
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white rounded-lg overflow-hidden">
        <CardContent className="p-3">
          <h3 className="font-medium mb-3 text-sm text-kutuku-primary">Customer Reviews</h3>
          
          {/* Review form */}
          <ReviewForm 
            shopId={shopId} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
          
          {/* Reviews list */}
          <div key={refreshKey}>
            <ReviewList shopId={shopId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopReviewsTab;
