
import React from 'react';
import { Button } from '@/components/ui/button';

const NewCollectionBanner: React.FC = () => {
  return (
    <div className="w-full py-12 px-4 bg-gray-100 rounded-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">New Collection</h2>
        <p className="text-gray-600 mb-6">
          Discover our latest styles for the season
        </p>
        <Button>Shop Now</Button>
      </div>
    </div>
  );
};

export default NewCollectionBanner;
