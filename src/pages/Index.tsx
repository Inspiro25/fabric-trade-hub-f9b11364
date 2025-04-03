
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import MeeshoHero from '@/components/home/MeeshoHero';
import MeeshoCategoryGrid from '@/components/home/MeeshoCategoryGrid';
import MeeshoTrendingProducts from '@/components/home/MeeshoTrendingProducts';
import MeeshoPromoCard from '@/components/home/MeeshoPromoCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, Star, TrendingUp, Percent, Clock } from 'lucide-react';

const Home = () => {
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('trending');
  
  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <MeeshoHero />
      
      <div className="container mx-auto px-4 py-6">
        <h2 className={cn(
          "text-xl md:text-2xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-purple-800"
        )}>
          Shop By Category
        </h2>
        
        <MeeshoCategoryGrid />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <MeeshoPromoCard 
            title="New Arrivals"
            description="Check out the latest fashion trends for the season"
            buttonText="Shop Now"
            buttonLink="/new-arrivals"
            imageSrc="https://images.meesho.com/images/marketing/1678691618669_400.webp"
            color="purple"
          />
          
          <MeeshoPromoCard 
            title="Special Offers"
            description="Save big with exclusive discounts and deals"
            buttonText="View Offers"
            buttonLink="/offers"
            imageSrc="https://images.meesho.com/images/marketing/1678691686252_300.webp"
            color="pink"
            direction="left"
          />
        </div>
        
        <div className="mt-12">
          <Tabs 
            defaultValue="trending" 
            className="w-full" 
            onValueChange={setActiveTab}
          >
            <TabsList className={cn(
              "grid grid-cols-4 mb-8",
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            )}>
              <TabsTrigger 
                value="trending" 
                className={cn(
                  "flex items-center gap-2",
                  isDarkMode && "data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                )}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="new" 
                className={cn(
                  "flex items-center gap-2",
                  isDarkMode && "data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                )}
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">New Arrivals</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="rated" 
                className={cn(
                  "flex items-center gap-2",
                  isDarkMode && "data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                )}
              >
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Top Rated</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="deals" 
                className={cn(
                  "flex items-center gap-2",
                  isDarkMode && "data-[state=active]:bg-purple-800 data-[state=active]:text-white"
                )}
              >
                <Percent className="h-4 w-4" />
                <span className="hidden sm:inline">Best Deals</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending">
              <MeeshoTrendingProducts 
                title="Trending Products" 
                query={{ isTrending: true, sortBy: 'popularity' }}
              />
            </TabsContent>
            
            <TabsContent value="new">
              <MeeshoTrendingProducts 
                title="New Arrivals" 
                query={{ isNew: true, sortBy: 'newest' }}
              />
            </TabsContent>
            
            <TabsContent value="rated">
              <MeeshoTrendingProducts 
                title="Top Rated Products" 
                query={{ sortBy: 'rating' }}
              />
            </TabsContent>
            
            <TabsContent value="deals">
              <MeeshoTrendingProducts 
                title="Best Deals" 
                query={{ withDiscount: true, sortBy: 'price-asc' }}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className={cn(
          "mt-12 p-6 rounded-xl text-center",
          isDarkMode 
            ? "bg-gray-800 border border-gray-700" 
            : "bg-white shadow-sm"
        )}>
          <h2 className={cn(
            "text-xl md:text-2xl font-bold mb-3",
            isDarkMode ? "text-white" : "text-purple-800"
          )}>
            Why Shop with Us?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="flex flex-col items-center">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-3",
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              )}>
                <Package className={isDarkMode ? "text-purple-300" : "text-purple-700"} />
              </div>
              <h3 className={cn(
                "font-medium mb-1",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>
                Free Shipping
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                On orders above ₹499
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-3",
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              )}>
                <Percent className={isDarkMode ? "text-purple-300" : "text-purple-700"} />
              </div>
              <h3 className={cn(
                "font-medium mb-1",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>
                Best Deals
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Lowest price guaranteed
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-3",
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              )}>
                <TrendingUp className={isDarkMode ? "text-purple-300" : "text-purple-700"} />
              </div>
              <h3 className={cn(
                "font-medium mb-1",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>
                Trending Products
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                Stay in style always
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-3",
                isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
              )}>
                <Star className={isDarkMode ? "text-purple-300" : "text-purple-700"} />
              </div>
              <h3 className={cn(
                "font-medium mb-1",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>
                Quality Assured
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                100% quality check
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
