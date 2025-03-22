
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function HomePromoBanner() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="px-4 py-6">
      <div className={cn(
        "relative rounded-lg overflow-hidden border",
        isDarkMode ? "bg-orange-950/30 border-orange-900/50" : "bg-orange-50 border-orange-100"
      )}>
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center mb-2">
            <div className="relative mr-2">
              <Sun className={cn(
                "h-5 w-5 text-kutuku-primary animate-pulse-subtle",
                isDarkMode && "text-orange-300"
              )} />
              <Sparkles className={cn(
                "h-3 w-3 absolute -top-1 -right-1 text-kutuku-primary animate-float",
                isDarkMode && "text-orange-300"
              )} />
            </div>
            <h3 className={cn(
              "text-xl font-bold",
              isDarkMode ? "text-orange-200" : "text-orange-900"
            )}>New Collection</h3>
          </div>
          <p className={cn(
            "mb-4 max-w-md",
            isDarkMode ? "text-orange-300/90" : "text-orange-800"
          )}>
            Discover our latest arrivals! Exclusive designs just added to our collection.
          </p>
          <Button className={cn(
            "bg-kutuku-primary hover:bg-kutuku-secondary text-white border-none",
            "relative overflow-hidden group"
          )} asChild>
            <Link to="/new-arrivals">
              <span className="relative z-10">Explore New Arrivals</span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className={cn(
          "absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-50",
          isDarkMode ? "bg-orange-700/30" : "bg-orange-200"
        )}></div>
        <div className={cn(
          "absolute right-8 -top-8 w-16 h-16 rounded-full opacity-30",
          isDarkMode ? "bg-orange-600/30" : "bg-orange-300"
        )}></div>
        
        {/* Sparkle decorations */}
        <Sparkles className={cn(
          "absolute top-4 right-8 h-3 w-3 animate-float",
          isDarkMode ? "text-orange-400" : "text-orange-500"
        )} />
        <Sparkles className={cn(
          "absolute bottom-6 left-12 h-2 w-2 animate-pulse-subtle",
          isDarkMode ? "text-orange-400" : "text-orange-500"
        )} />
      </div>
    </div>
  );
}
