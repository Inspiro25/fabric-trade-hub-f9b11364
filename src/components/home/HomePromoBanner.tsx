
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun } from 'lucide-react';

export default function HomePromoBanner() {
  return (
    <div className="px-4 py-6">
      <div className="relative rounded-lg overflow-hidden bg-orange-50 border border-orange-100">
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center mb-2">
            <Sun className="h-5 w-5 text-kutuku-primary mr-2" />
            <h3 className="text-xl font-bold text-orange-900">Special Offer</h3>
          </div>
          <p className="text-orange-800 mb-4 max-w-md">
            Get up to 40% off on selected items this week. Limited time offer!
          </p>
          <Button className="bg-kutuku-primary hover:bg-kutuku-secondary text-white border-none" asChild>
            <Link to="/category/sale">Shop Now</Link>
          </Button>
        </div>
        
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
        <div className="absolute right-8 -top-8 w-16 h-16 bg-orange-300 rounded-full opacity-30"></div>
      </div>
    </div>
  );
}
