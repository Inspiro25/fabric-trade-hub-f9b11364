
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { useDiscountedProducts } from '@/hooks/use-product-fetching';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const HomeFlashSale = () => {
  const { isDarkMode } = useTheme();
  const { data: discountedProducts = [], isLoading, error } = useDiscountedProducts(8);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [activeOffer, setActiveOffer] = useState<any>(null);

  // Fetch active flash sale from the database
  useEffect(() => {
    const fetchActiveOffer = async () => {
      const now = new Date();
      
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .eq('type', 'flash_sale')
          .gte('expiry', now.toISOString())
          .order('expiry', { ascending: true })
          .limit(1);
          
        if (error) {
          console.error('Error fetching flash sale offer:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setActiveOffer(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch flash sale:', err);
      }
    };
    
    fetchActiveOffer();
  }, []);

  // Calculate time left
  useEffect(() => {
    if (!activeOffer) {
      // Default to 24 hours if no active offer
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 24);
      
      const interval = setInterval(() => {
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          clearInterval(interval);
          return;
        }
        
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      const endTime = new Date(activeOffer.expiry);
      
      const interval = setInterval(() => {
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          clearInterval(interval);
          return;
        }
        
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [activeOffer]);

  if (!discountedProducts || discountedProducts.length === 0) {
    return null; // Don't show if no flash sale products
  }

  return (
    <section className={cn(
      "py-10", 
      isDarkMode ? "bg-gray-900" : "bg-orange-50"
    )}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className={cn(
              "text-2xl font-bold flex items-center",
              isDarkMode ? "text-white" : ""
            )}>
              <span className={cn(
                "text-2xl mr-2",
                isDarkMode ? "text-orange-400" : "text-orange-500"
              )}>⚡</span>
              {activeOffer?.title || "Flash Sale"}
            </h2>
            <p className={cn(
              "text-sm mt-1",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {activeOffer?.description || "Special discounts for a limited time"}
            </p>
          </div>
          
          <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end">
            <div className="flex items-center gap-1 mb-2">
              <Timer className={cn(
                "h-4 w-4",
                isDarkMode ? "text-orange-400" : "text-orange-500"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-white" : ""
              )}>
                Ends in:
              </span>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono",
                  isDarkMode ? "bg-gray-700" : "bg-gray-800"
                )}>
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className={isDarkMode ? "text-white" : ""}>:</span>
                <span className={cn(
                  "bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono",
                  isDarkMode ? "bg-gray-700" : "bg-gray-800"
                )}>
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className={isDarkMode ? "text-white" : ""}>:</span>
                <span className={cn(
                  "bg-gray-800 text-white px-2 py-1 rounded text-sm font-mono",
                  isDarkMode ? "bg-gray-700" : "bg-gray-800"
                )}>
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <Link to="/flash-sale">
              <Button variant="link" className={isDarkMode ? "text-orange-400" : "text-orange-500"}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className={cn(
                "overflow-hidden",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-red-500">Error loading flash sale products</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {discountedProducts.slice(0, 8).map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images[0]}
                category={product.category}
                isNew={product.isNew}
                isTrending={product.isTrending}
                rating={product.rating}
                reviewCount={product.reviewCount}
                highlight="sale"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeFlashSale;
