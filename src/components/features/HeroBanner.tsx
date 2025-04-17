
import React from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const HeroBanner: React.FC = () => {
  return (
    <Carousel className="w-full mb-6">
      <CarouselContent>
        <CarouselItem>
          <div className="relative h-48 w-full overflow-hidden rounded-lg mx-4">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
              alt="Fashion sale" 
              className="w-full h-full object-cover"
              loading="eager" // Prioritize this image
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-bold mb-2">Summer Sale</h2>
              <p className="text-white mb-3">Up to 50% off on summer collection</p>
              <Button size="sm" className="w-fit bg-kutuku-primary hover:bg-kutuku-secondary">
                Shop Now
              </Button>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="relative h-48 w-full overflow-hidden rounded-lg mx-4">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471" 
              alt="New arrivals" 
              className="w-full h-full object-cover"
              loading="lazy" // Defer loading this image
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-bold mb-2">New Arrivals</h2>
              <p className="text-white mb-3">Fresh styles for the season</p>
              <Button size="sm" className="w-fit bg-kutuku-primary hover:bg-kutuku-secondary">
                Explore
              </Button>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
        <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    </Carousel>
  );
};

export default React.memo(HeroBanner);
