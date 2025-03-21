
import React from 'react';
import { Button } from '@/components/ui/button';

const DealOfTheDay = () => {
  // This would typically fetch from an API
  // For now using static data to improve performance
  
  return (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Deal of the Day</h2>
        <a href="/category/deals" className="text-kutuku-primary text-sm font-medium flex items-center">
          See All
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="relative aspect-[5/3] w-full">
          <img 
            src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1974" 
            alt="Deal of the Day" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -30%
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-medium mb-1">Summer Collection 2023</h3>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-kutuku-primary mr-2">₹1,399</span>
            <span className="text-sm line-through text-gray-400">₹1,999</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="bg-gray-100 rounded-md p-2 text-center">
              <span className="block text-sm font-bold">12</span>
              <span className="text-xs text-gray-500">Hours</span>
            </div>
            <div className="bg-gray-100 rounded-md p-2 text-center">
              <span className="block text-sm font-bold">45</span>
              <span className="text-xs text-gray-500">Mins</span>
            </div>
            <div className="bg-gray-100 rounded-md p-2 text-center">
              <span className="block text-sm font-bold">52</span>
              <span className="text-xs text-gray-500">Secs</span>
            </div>
            <Button className="bg-kutuku-primary hover:bg-kutuku-secondary text-white w-full">
              Buy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DealOfTheDay);
