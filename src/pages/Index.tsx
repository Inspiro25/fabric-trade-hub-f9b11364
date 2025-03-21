
import { useEffect, Suspense, lazy } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import AppHeader from '@/components/features/AppHeader';
import HeroBanner from '@/components/features/HeroBanner';
import HomeCategories from '@/components/features/HomeCategories';
import SectionLoading from '@/components/ui/SectionLoading';

// Lazy loading of sections to improve initial load performance
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));
const ProductSection = lazy(() => import('@/components/features/ProductSection'));
const Hero = lazy(() => import('@/components/features/Hero'));

const Index = () => {
  const { 
    categories, 
    newArrivals, 
    bestSellers, 
    topRatedProducts, 
    discountedProducts,
    isLoading, 
    dataLoaded,
    hasErrors
  } = useHomeData();

  useEffect(() => {
    // Handle hash navigation
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // If there are errors, still render the basic UI with available data
  if (hasErrors) {
    console.error("Some queries encountered errors but we'll show what we can");
  }

  // Show optimized loading state - but with a fallback to display at least something
  if (isLoading && !dataLoaded.categories) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kutuku-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-gray-50 dark:bg-gray-900">
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content */}
      <main className="pb-4">
        {/* Hero Banner Carousel */}
        <HeroBanner />
        
        {/* Categories - will always show first because we load them first */}
        {dataLoaded.categories && <HomeCategories categories={categories} />}
        
        {/* Deal of the Day - lazy loaded */}
        <Suspense fallback={<SectionLoading />}>
          <DealOfTheDay />
        </Suspense>
        
        {/* New Arrivals Section - progressive loading */}
        {dataLoaded.newArrivals && newArrivals.length > 0 && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="New Arrivals"
              products={newArrivals.slice(0, 4)}
              linkTo="/category/new-arrivals"
            />
          </Suspense>
        )}
        
        {/* Best Sellers Section - progressive loading */}
        {dataLoaded.bestSellers && bestSellers.length > 0 && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="Best Sellers"
              products={bestSellers.slice(0, 4)}
              linkTo="/category/best-sellers"
            />
          </Suspense>
        )}
        
        {/* Top Rated Products - lazy loaded */}
        {dataLoaded.topRated && topRatedProducts.length > 0 && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="Top Rated"
              products={topRatedProducts.slice(0, 4)}
              linkTo="/category/top-rated"
            />
          </Suspense>
        )}
        
        {/* Discounted Products - lazy loaded */}
        {dataLoaded.discounted && discountedProducts.length > 0 && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="On Sale"
              products={discountedProducts.slice(0, 4)}
              linkTo="/category/sale"
            />
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default Index;
