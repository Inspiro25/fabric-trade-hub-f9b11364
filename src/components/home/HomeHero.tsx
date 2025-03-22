
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-white py-4 md:py-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                Discover Your Style
              </h1>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Explore premium fashion items for your comfort and style.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link to="/new-arrivals">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop Now
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="border-orange-200" asChild>
                  <Link to="/trending">Trending</Link>
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
                alt="Fashion collection" 
                className="w-full h-auto rounded-lg shadow-sm"
                loading="eager"
                style={{ maxHeight: "350px", objectFit: "cover" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
