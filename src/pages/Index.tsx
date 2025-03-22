
import React, { Suspense, lazy, useEffect } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import AppHeader from '@/components/features/AppHeader';
import HomeHero from '@/components/home/HomeHero';
import HomeCategoryGrid from '@/components/home/HomeCategoryGrid';
import HomeProductShowcase from '@/components/home/HomeProductShowcase';
import HomePromoBanner from '@/components/home/HomePromoBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

// Lazy loaded components for less important sections
const SectionLoading = () => <Skeleton className="h-32 w-full" />;
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));

const Index = () => {
  const { 
    categories, 
    newArrivals, 
    bestSellers, 
    topRatedProducts, 
    discountedProducts,
    isLoading, 
    dataLoaded,
  } = useHomeData();

  useEffect(() => {
    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Lightweight fallback loading state
  if (isLoading && !categories.length) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="py-4 px-4 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HomeHero />
        
        {/* Categories Grid */}
        <HomeCategoryGrid 
          categories={categories} 
          isLoading={!dataLoaded.categories} 
        />
        
        {/* Trending Now Banner */}
        <Link to="/trending" className="block mx-4 my-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 shadow-md text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Flame className="h-6 w-6 mr-2" />
                <h2 className="text-lg font-bold">Trending Now</h2>
              </div>
              <span className="text-sm font-medium">See All →</span>
            </div>
            <p className="text-sm mt-1 text-white/80">Discover what's hot right now</p>
          </div>
        </Link>
        
        {/* Deal of the Day - lazy loaded */}
        <Suspense fallback={<SectionLoading />}>
          <DealOfTheDay />
        </Suspense>
        
        {/* Promo Banner */}
        <HomePromoBanner />
        
        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <HomeProductShowcase
            title="New Arrivals"
            products={newArrivals}
            linkTo="/new-arrivals"
            isLoaded={dataLoaded.newArrivals}
          />
        )}
        
        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <HomeProductShowcase
            title="Best Sellers"
            products={bestSellers}
            linkTo="/category/best-sellers"
            isLoaded={dataLoaded.bestSellers}
          />
        )}
        
        {/* Top Rated */}
        {topRatedProducts.length > 0 && (
          <HomeProductShowcase
            title="Top Rated"
            products={topRatedProducts}
            linkTo="/category/top-rated"
            isLoaded={dataLoaded.topRated}
          />
        )}
        
        {/* On Sale */}
        {discountedProducts.length > 0 && (
          <HomeProductShowcase
            title="On Sale"
            products={discountedProducts}
            linkTo="/category/sale"
            isLoaded={dataLoaded.discounted}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
