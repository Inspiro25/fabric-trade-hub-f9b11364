
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useHomeData } from '@/hooks/use-home-data';
import { useCategories } from '@/hooks/use-categories';
import { useBestSellers } from '@/hooks/use-best-sellers';
import HomeHero from '@/components/home/HomeHero';
import HomeCategories from '@/components/home/HomeCategories';
import HomeNewArrivals from '@/components/home/HomeNewArrivals';
import HomeTrendingProducts from '@/components/home/HomeTrendingProducts';
import HomeFlashSale from '@/components/home/HomeFlashSale';
import HomeBestSellers from '@/components/home/HomeBestSellers';

const IndexPage = () => {
  const { isDarkMode } = useTheme();
  const homeData = useHomeData();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { bestSellers, isLoading: isBestSellersLoading } = useBestSellers();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Check if data is loaded
  useEffect(() => {
    const isLoaded = !homeData.isLoading && !isCategoriesLoading && !isBestSellersLoading;
    if (isLoaded) {
      setDataLoaded(true);
    }
  }, [homeData.isLoading, isCategoriesLoading, isBestSellersLoading]);

  return (
    <>
      <Helmet>
        <title>Kutuku - Online Shopping Marketplace</title>
        <meta name="description" content="Discover the best products from verified sellers across the globe. Shop clothes, electronics, home goods and more." />
      </Helmet>
      
      <div className={cn("min-h-screen pb-10", isDarkMode ? "bg-gray-900 text-white" : "bg-white")}>
        {/* Hero Section */}
        <HomeHero />
        
        {/* Categories Section */}
        <section className={cn("py-12", isDarkMode ? "bg-gray-900" : "bg-white")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Shop by Category
              </h2>
              <a 
                href="/categories" 
                className={cn(
                  "text-sm font-medium mt-2 md:mt-0",
                  isDarkMode 
                    ? "text-orange-400 hover:text-orange-300" 
                    : "text-kutuku-primary hover:text-kutuku-secondary"
                )}
              >
                View All Categories
              </a>
            </div>
            <HomeCategories 
              categories={categories}
              isLoading={isCategoriesLoading}
            />
          </div>
        </section>
        
        {/* New Arrivals Section */}
        <section className={cn("py-12", isDarkMode ? "bg-gray-800/50" : "bg-gray-50")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                New Arrivals
              </h2>
              <a 
                href="/new-arrivals" 
                className={cn(
                  "text-sm font-medium mt-2 md:mt-0",
                  isDarkMode 
                    ? "text-orange-400 hover:text-orange-300" 
                    : "text-kutuku-primary hover:text-kutuku-secondary"
                )}
              >
                View All New Arrivals
              </a>
            </div>
            <HomeNewArrivals 
              products={homeData.newArrivals?.data || []}
              isLoading={homeData.isLoading}
            />
          </div>
        </section>
        
        {/* Trending Products Section */}
        <section className={cn("py-12", isDarkMode ? "bg-gray-900" : "bg-white")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Trending Products
              </h2>
              <a 
                href="/trending" 
                className={cn(
                  "text-sm font-medium mt-2 md:mt-0",
                  isDarkMode 
                    ? "text-orange-400 hover:text-orange-300" 
                    : "text-kutuku-primary hover:text-kutuku-secondary"
                )}
              >
                View All Trending Products
              </a>
            </div>
            <HomeTrendingProducts 
              products={homeData.trendingProducts?.data || []}
              isLoading={homeData.isLoading}
            />
          </div>
        </section>
        
        {/* Best Sellers Section */}
        <section className={cn("py-12", isDarkMode ? "bg-gray-800/50" : "bg-gray-50")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Best Sellers
              </h2>
              <a 
                href="/best-sellers" 
                className={cn(
                  "text-sm font-medium mt-2 md:mt-0",
                  isDarkMode 
                    ? "text-orange-400 hover:text-orange-300" 
                    : "text-kutuku-primary hover:text-kutuku-secondary"
                )}
              >
                View All Best Sellers
              </a>
            </div>
            <HomeBestSellers 
              products={bestSellers || []}
              isLoading={isBestSellersLoading}
            />
          </div>
        </section>
        
        {/* Flash Sale Section */}
        <section className={cn("py-12", isDarkMode ? "bg-gray-900" : "bg-white")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Flash Sale
              </h2>
              <a 
                href="/sales" 
                className={cn(
                  "text-sm font-medium mt-2 md:mt-0",
                  isDarkMode 
                    ? "text-orange-400 hover:text-orange-300" 
                    : "text-kutuku-primary hover:text-kutuku-secondary"
                )}
              >
                View All Deals
              </a>
            </div>
            <HomeFlashSale 
              products={homeData.discountedProducts?.data || []}
              isLoading={homeData.isLoading}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default IndexPage;
