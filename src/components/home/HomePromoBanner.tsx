
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function HomePromoBanner() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative rounded-xl overflow-hidden border shadow-lg",
          isDarkMode ? "bg-gradient-to-br from-orange-950/40 to-orange-900/30 border-orange-900/50" : 
                       "bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200"
        )}
      >
        <div className="px-6 py-8 md:px-8 md:py-10 z-10 relative">
          <div className="flex items-center mb-3">
            <div className="relative mr-2">
              <Sun className={cn(
                "h-5 w-5 text-orange-500 animate-pulse-subtle",
                isDarkMode && "text-orange-300"
              )} />
              <Sparkles className={cn(
                "h-3 w-3 absolute -top-1 -right-1 text-orange-500 animate-float",
                isDarkMode && "text-orange-300"
              )} />
            </div>
            <h3 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-orange-200" : "text-orange-800"
            )}>New Collection</h3>
          </div>
          
          <p className={cn(
            "mb-6 max-w-md text-base",
            isDarkMode ? "text-orange-300/90" : "text-orange-700"
          )}>
            Discover our latest arrivals! Exclusive designs with premium quality materials, perfect for upgrading your style.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button className={cn(
              "bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md",
              "relative overflow-hidden group"
            )} asChild>
              <Link to="/new-arrivals">
                <span className="relative z-10 flex items-center">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </Button>
            
            <Button variant="outline" className={cn(
              isDarkMode ? "border-orange-700 text-orange-300" : "border-orange-300 text-orange-700",
              "hover:bg-orange-100/10"
            )} asChild>
              <Link to="/category/featured">
                <Star className="mr-2 h-4 w-4" />
                Featured Items
              </Link>
            </Button>
          </div>
          
          {/* Animated product tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Summer Essentials', 'Office Wear', 'Weekend Style'].map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <span className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs font-medium",
                  isDarkMode ? "bg-orange-900/50 text-orange-200" : "bg-orange-100 text-orange-700"
                )}>
                  {tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className={cn(
          "absolute -right-12 -bottom-12 w-40 h-40 rounded-full opacity-50",
          isDarkMode ? "bg-orange-700/30" : "bg-orange-200"
        )}></div>
        <div className={cn(
          "absolute right-1/3 -bottom-8 w-24 h-24 rounded-full opacity-30",
          isDarkMode ? "bg-orange-600/30" : "bg-orange-300"
        )}></div>
        <div className={cn(
          "absolute left-1/3 -top-8 w-20 h-20 rounded-full opacity-20",
          isDarkMode ? "bg-orange-600/30" : "bg-orange-300"
        )}></div>
        
        {/* Sparkle decorations */}
        <Sparkles className={cn(
          "absolute top-4 right-8 h-4 w-4 animate-float",
          isDarkMode ? "text-orange-400" : "text-orange-500"
        )} />
        <Sparkles className={cn(
          "absolute bottom-6 left-12 h-3 w-3 animate-pulse-subtle",
          isDarkMode ? "text-orange-400" : "text-orange-500"
        )} />
        <Sparkles className={cn(
          "absolute top-1/3 left-1/4 h-2 w-2 animate-float",
          isDarkMode ? "text-orange-400" : "text-orange-500"
        )} />
      </motion.div>
    </div>
  );
}
