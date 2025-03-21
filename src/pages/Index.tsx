
import { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { getNewArrivals, getTrendingProducts, getAllCategories, getTopRatedProducts, getDiscountedProducts, getBestSellingProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import HomeCategories from '@/components/features/HomeCategories';
import NotificationBadge from '@/components/features/NotificationBadge';
import NotificationTest from '@/components/features/NotificationTest';

// Lazy loading of sections to improve initial load performance
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));
const ProductSection = lazy(() => import('@/components/features/ProductSection'));

// Simple loading placeholder component
const SectionLoading = () => (
  <div className="px-4 py-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
      ))}
    </div>
  </div>
);

const Index = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track which data has been loaded to enable progressive loading
  const [dataLoaded, setDataLoaded] = useState({
    categories: false,
    newArrivals: false,
    bestSellers: false,
    topRated: false,
    discounted: false
  });

  useEffect(() => {
    // This function will fetch data progressively to improve perceived performance
    const fetchData = async () => {
      try {
        // First priority - categories and new arrivals
        const [categoriesData, newArrivalsData] = await Promise.all([
          getAllCategories(),
          getNewArrivals()
        ]);
        
        setCategories(categoriesData);
        setNewArrivals(newArrivalsData);
        setDataLoaded(prev => ({...prev, categories: true, newArrivals: true}));
        
        // Second priority - trending and best sellers
        const [trendingData, bestSellersData] = await Promise.all([
          getTrendingProducts(),
          getBestSellingProducts()
        ]);
        
        setTrendingProducts(trendingData);
        setBestSellers(bestSellersData);
        setDataLoaded(prev => ({...prev, bestSellers: true}));
        
        // Lower priority - load other data
        const [topRatedData, discountedData] = await Promise.all([
          getTopRatedProducts(),
          getDiscountedProducts()
        ]);
        
        setTopRatedProducts(topRatedData);
        setDiscountedProducts(discountedData);
        setDataLoaded(prev => ({...prev, topRated: true, discounted: true}));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

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

  // Show optimized loading state
  if (isLoading && !dataLoaded.categories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-gray-50">
      {/* App Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-kutuku-primary">Kutuku</h1>
            <p className="text-xs text-gray-500">Welcome back!</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBadge />
            <Link to="/search" className="text-gray-700">
              <Search size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="pb-4">
        {/* Hero Banner Carousel */}
        <Carousel className="w-full mb-6">
          <CarouselContent>
            <CarouselItem>
              <div className="relative h-48 w-full overflow-hidden rounded-lg mx-4">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
                  alt="Fashion sale" 
                  className="w-full h-full object-cover"
                  loading="eager" // Prioritize this image
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-white text-2xl font-bold mb-2">Summer Sale</h2>
                  <p className="text-white mb-3">Up to 50% off on summer collection</p>
                  <Button size="sm" className="w-fit bg-kutuku-primary hover:bg-kutuku-secondary">
                    Shop Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-48 w-full overflow-hidden rounded-lg mx-4">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471" 
                  alt="New arrivals" 
                  className="w-full h-full object-cover"
                  loading="lazy" // Defer loading this image
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h2 className="text-white text-2xl font-bold mb-2">New Arrivals</h2>
                  <p className="text-white mb-3">Fresh styles for the season</p>
                  <Button size="sm" className="w-fit bg-kutuku-primary hover:bg-kutuku-secondary">
                    Explore
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </Carousel>
        
        {/* Categories - will always show first because we load them first */}
        {dataLoaded.categories && <HomeCategories categories={categories} />}
        
        {/* Deal of the Day - lazy loaded */}
        <Suspense fallback={<SectionLoading />}>
          <DealOfTheDay />
        </Suspense>
        
        {/* New Arrivals Section - progressive loading */}
        {dataLoaded.newArrivals && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="New Arrivals"
              products={newArrivals.slice(0, 4)}
              linkTo="/category/new-arrivals"
            />
          </Suspense>
        )}
        
        {/* Best Sellers Section - progressive loading */}
        {dataLoaded.bestSellers && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="Best Sellers"
              products={bestSellers.slice(0, 4)}
              linkTo="/category/best-sellers"
            />
          </Suspense>
        )}
        
        {/* Top Rated Products - lazy loaded */}
        {dataLoaded.topRated && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="Top Rated"
              products={topRatedProducts.slice(0, 4)}
              linkTo="/category/top-rated"
            />
          </Suspense>
        )}
        
        {/* Discounted Products - lazy loaded */}
        {dataLoaded.discounted && (
          <Suspense fallback={<SectionLoading />}>
            <ProductSection 
              title="On Sale"
              products={discountedProducts.slice(0, 4)}
              linkTo="/category/sale"
            />
          </Suspense>
        )}
      </main>
      
      {/* Notification Test Component (only for development) */}
      <NotificationTest />
    </div>
  );
};

export default Index;
