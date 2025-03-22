
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HomeHero() {
  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-white py-6 md:py-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
              Discover Your Style
            </h1>
            <p className="text-gray-600 mb-6 md:pr-12">
              Explore our curated collections of premium fashion items designed for your comfort and style.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link to="/category/new-arrivals">
                  Shop New Arrivals
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-orange-200" asChild>
                <Link to="/category/trending">Trending Now</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
              alt="Fashion collection" 
              className="w-full h-auto rounded-lg shadow-md"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
