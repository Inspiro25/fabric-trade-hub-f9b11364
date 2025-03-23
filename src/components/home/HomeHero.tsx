
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const HomeHero = () => {
  const { isDarkMode, primaryColor } = useTheme();
  
  return (
    <div className="relative mx-4 mb-4 overflow-hidden rounded-xl shadow-lg">
      <div className={cn(
        "relative z-10 p-6 md:p-10",
        isDarkMode 
          ? "bg-gradient-to-r from-gray-900/90 to-gray-800/80 border border-gray-800" 
          : "bg-gradient-to-r from-orange-100/90 to-white/70 border border-orange-100"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg space-y-4"
        >
          <div className="flex gap-2 items-center mb-2">
            <Sparkle className={cn("h-5 w-5", isDarkMode ? "text-orange-400" : "text-orange-500")} />
            <span className={cn(
              "text-sm font-medium px-2 py-0.5 rounded-full",
              isDarkMode ? "bg-orange-500/20 text-orange-300" : "bg-orange-100 text-orange-700"
            )}>
              New Collection
            </span>
          </div>
          
          <h1 className={cn(
            "text-3xl md:text-4xl font-bold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Discover the latest in{" "}
            <span className={isDarkMode ? "text-orange-400" : "text-orange-500"}>
              fashion & technology
            </span>
          </h1>
          
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Shop the newest arrivals, limited editions, and exclusive deals
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              className={isDarkMode ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-500 hover:bg-orange-600"} 
              asChild
            >
              <Link to="/new-arrivals">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className={cn(
                "border-2",
                isDarkMode 
                  ? "border-orange-500/30 text-orange-400 hover:bg-orange-950/50" 
                  : "border-orange-200 hover:bg-orange-50"
              )} 
              asChild
            >
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
