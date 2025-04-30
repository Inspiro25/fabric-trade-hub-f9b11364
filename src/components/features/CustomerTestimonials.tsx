
import React from 'react';

const CustomerTestimonials: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-medium">Customer {index}</h3>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Nullam euismod, nisl eget ultricies aliquam.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
