
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const HomeHero = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="relative mt-4 mx-4 mb-6 overflow-hidden rounded-xl">
      <div className={cn(
        "relative z-10 p-6 md:p-10",
        isDarkMode ? "bg-gradient-to-r from-orange-950/90 to-gray-900/70" : "bg-gradient-to-r from-orange-100/90 to-white/70"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg space-y-4"
        >
          <h1 className={cn(
            "text-3xl md:text-4xl font-bold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Discover the latest in fashion & technology
          </h1>
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Shop the newest arrivals, limited editions, and exclusive deals
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link to="/new-arrivals">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Link>
            </Button>
            <Button variant="outline" className={cn(
              "border-2",
              isDarkMode ? "border-orange-400/30 text-orange-400 hover:bg-orange-950/50" : "border-orange-200 hover:bg-orange-50"
            )} asChild>
              <Link to="/trending-now">
                Trending Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop"
        alt="Hero Banner" 
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60"
      />
    </div>
  );
};

export default HomeHero;
