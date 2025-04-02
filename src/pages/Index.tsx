import React, { useState, useEffect } from 'react';
import { useHomePageData } from '@/hooks/use-home-data';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHome from '@/components/mobile/MobileHome';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Star, Clock, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import ProductSection from '@/components/features/ProductSection';
import CategorySection from '@/components/features/CategorySection';
import PaymentButton from '@/components/features/PaymentButton';
import HomeCategories from '@/components/features/HomeCategories';
import DealOfTheDay from '@/components/features/DealOfTheDay';
import HeroBanner from '@/components/features/HeroBanner';
import Hero from '@/components/features/Hero';
import HomeHero from '@/components/home/HomeHero';
import HomeCategoryGrid from '@/components/home/HomeCategoryGrid';
import HomeProductShowcase from '@/components/home/HomeProductShowcase';
import HomePromoBanner from '@/components/home/HomePromoBanner';
import FlashSaleTimer from '@/components/home/FlashSaleTimer';
import { ElectronicsShowcase } from '@/components/home/ElectronicsShowcase';
import ShopsSpotlight from '@/components/home/ShopsSpotlight';
import { Suspense } from 'react';

const LazyHomeProductShowcase = React.lazy(() => import('@/components/home/HomeProductShowcase'));

const Home = () => {
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  const { products, isLoading } = useHomePageData();

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <HomeHero />
      <div className="container mx-auto px-4 py-8">
        <HomeCategoryGrid />

        <HomePromoBanner 
          title="Summer Collection 2023"
          description="Discover our new arrivals and refresh your style"
          buttonText="Shop Now"
          buttonLink="/categories/summer"
          image="/assets/promo-banner.jpg"
          direction="right"
        />
        
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>Flash Sale <span className="text-red-500">⚡</span></h2>
            <FlashSaleTimer endTime={new Date('2023-12-31T00:00:00')} />
          </div>
          
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-2">
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>}>
            <LazyHomeProductShowcase 
              products={products?.slice(0, 4) || []}
              isLoading={isLoading}
              showDiscount={true}
            />
          </Suspense>
          
          <div className="mt-4 text-center">
            <Link to="/offers">
              <Button variant="outline" className="rounded-full">
                View All Offers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <HomePromoBanner 
            title="Electronics"
            description="Latest gadgets and tech"
            buttonText="Explore"
            buttonLink="/categories/electronics"
            image="/assets/electronics-banner.jpg"
            direction="left"
          />
          
          <HomePromoBanner 
            title="Home Decor"
            description="Transform your living space"
            buttonText="Discover"
            buttonLink="/categories/home-decor"
            image="/assets/home-decor-banner.jpg"
            direction="left"
          />
        </div>
        
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <span className="flex items-center">
                New Arrivals
                <Clock className="ml-2 h-5 w-5" />
              </span>
            </h2>
            
            <Link to="/new-arrivals" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-2">
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>}>
            <HomeProductShowcase 
              products={products?.slice(4, 8) || []}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
        
        <ElectronicsShowcase />
        
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <span className="flex items-center">
                Trending Products
                <TrendingUp className="ml-2 h-5 w-5" />
              </span>
            </h2>
            
            <Link to="/trending-now" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-2">
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>}>
            <HomeProductShowcase 
              products={products?.slice(8, 12) || []}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
        
        <ShopsSpotlight />
        
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              <span className="flex items-center">
                Top Rated
                <Star className="ml-2 h-5 w-5 text-yellow-500" />
              </span>
            </h2>
            
            <Link to="/top-rated" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-2">
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>}>
            <HomeProductShowcase 
              products={products?.slice(12, 16) || []}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Home;
