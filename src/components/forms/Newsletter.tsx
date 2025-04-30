
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-3">Subscribe to our newsletter</h2>
      <p className="text-gray-600 mb-6">
        Get the latest updates on new products and upcoming sales
      </p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input 
          type="email" 
          placeholder="Your email address"
          className="flex-grow"
        />
        <Button>Subscribe</Button>
      </div>
    </div>
  );
};

export default Newsletter;
