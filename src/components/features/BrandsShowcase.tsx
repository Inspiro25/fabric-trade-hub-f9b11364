
import React from 'react';

const BrandsShowcase: React.FC = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Brands</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div 
            key={index}
            className="h-20 bg-gray-100 rounded-md flex items-center justify-center"
          >
            Brand {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsShowcase;
