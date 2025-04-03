
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

const MeeshoHero = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "relative overflow-hidden",
      isDarkMode 
        ? "bg-gray-900" 
        : "bg-gradient-to-r from-purple-50 to-pink-50"
    )}>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className={cn(
              "text-3xl md:text-5xl font-bold tracking-tight",
              isDarkMode ? "text-white" : "text-purple-800"
            )}>
              Lowest Prices on <span className="text-pink-600">Fashion</span>
            </h1>
            
            <p className={cn(
              "mt-4 text-lg",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Shop from a wide selection of clothing, accessories, home decor and more
            </p>
            
            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-4">
              <Link to="/search" className="w-full md:w-auto">
                <Button 
                  className={cn(
                    "w-full md:w-auto text-white",
                    isDarkMode 
                      ? "bg-purple-700 hover:bg-purple-800" 
                      : "bg-purple-600 hover:bg-purple-700"
                  )}
                  size="lg"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </Link>
              
              <Link to="/categories" className="w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full md:w-auto",
                    isDarkMode
                      ? "border-purple-700 text-purple-400 hover:bg-purple-900/20"
                      : "border-purple-300 text-purple-700 hover:bg-purple-50"
                  )}
                  size="lg"
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
            
            <div className={cn(
              "mt-8 p-3 rounded-lg inline-block",
              isDarkMode 
                ? "bg-gray-800 text-gray-300" 
                : "bg-white/80 backdrop-blur-sm shadow-sm text-gray-700"
            )}>
              <p className="text-sm font-medium">Free delivery on orders above ₹499</p>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="aspect-square relative z-10">
              <img 
                src="https://images.meesho.com/images/marketing/1686234459500_512.webp" 
                alt="Meesho Fashion Collection" 
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className={cn(
              "absolute -right-4 -bottom-4 w-40 h-40 rounded-full z-0",
              isDarkMode ? "bg-purple-900/50" : "bg-pink-200/50"
            )}></div>
            
            <div className={cn(
              "absolute -left-4 -top-4 w-24 h-24 rounded-full z-0",
              isDarkMode ? "bg-pink-900/50" : "bg-purple-200/50"
            )}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeeshoHero;
