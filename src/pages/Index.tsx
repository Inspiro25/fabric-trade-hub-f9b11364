import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { getNewArrivals, getTrendingProducts, getAllCategories, getTopRatedProducts, getDiscountedProducts, getBestSellingProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import HomeCategories from '@/components/features/HomeCategories';
import NotificationBadge from '@/components/features/NotificationBadge';
import NotificationTest from '@/components/features/NotificationTest';

const Index = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          newArrivalsData, 
          trendingData, 
          topRatedData, 
          discountedData, 
          bestSellersData,
          categoriesData
        ] = await Promise.all([
          getNewArrivals(),
          getTrendingProducts(),
          getTopRatedProducts(),
          getDiscountedProducts(),
          getBestSellingProducts(),
          getAllCategories()
        ]);
        
        setNewArrivals(newArrivalsData);
        setTrendingProducts(trendingData);
        setTopRatedProducts(topRatedData);
        setDiscountedProducts(discountedData);
        setBestSellers(bestSellersData);
        setCategories(categoriesData);
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

  // Show loading state
  if (isLoading) {
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
        
        {/* Categories */}
        <HomeCategories categories={categories} />
        
        {/* Deal of the Day */}
        <section className="mb-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Deal of the Day</h2>
            <Link to="/category/deals" className="text-kutuku-primary text-sm font-medium flex items-center">
              See All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-[5/3] w-full">
              <img 
                src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1974" 
                alt="Deal of the Day" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -30%
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-base font-medium mb-1">Summer Collection 2023</h3>
              <div className="flex items-center mb-2">
                <span className="text-lg font-bold text-kutuku-primary mr-2">₹1,399</span>
                <span className="text-sm line-through text-gray-400">₹1,999</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-100 rounded-md p-2 text-center">
                  <span className="block text-sm font-bold">12</span>
                  <span className="text-xs text-gray-500">Hours</span>
                </div>
                <div className="bg-gray-100 rounded-md p-2 text-center">
                  <span className="block text-sm font-bold">45</span>
                  <span className="text-xs text-gray-500">Mins</span>
                </div>
                <div className="bg-gray-100 rounded-md p-2 text-center">
                  <span className="block text-sm font-bold">52</span>
                  <span className="text-xs text-gray-500">Secs</span>
                </div>
                <Button className="bg-kutuku-primary hover:bg-kutuku-secondary text-white w-full">
                  Buy
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* New Arrivals Section */}
        <section className="mb-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">New Arrivals</h2>
            <Link to="/category/new-arrivals" className="text-kutuku-primary text-sm font-medium flex items-center">
              See All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="compact"
                gridCols={2}
              />
            ))}
          </div>
        </section>
        
        {/* Best Sellers Section */}
        <section className="mb-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Best Sellers</h2>
            <Link to="/category/best-sellers" className="text-kutuku-primary text-sm font-medium flex items-center">
              See All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="compact"
                gridCols={2}
              />
            ))}
          </div>
        </section>
        
        {/* Top Rated Products */}
        <section className="mb-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Top Rated</h2>
            <Link to="/category/top-rated" className="text-kutuku-primary text-sm font-medium flex items-center">
              See All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {topRatedProducts.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="compact"
                gridCols={2}
              />
            ))}
          </div>
        </section>
        
        {/* Discounted Products */}
        <section className="mb-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">On Sale</h2>
            <Link to="/category/sale" className="text-kutuku-primary text-sm font-medium flex items-center">
              See All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {discountedProducts.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                variant="compact"
                gridCols={2}
              />
            ))}
          </div>
        </section>
      </main>
      
      {/* Notification Test Component (only for development) */}
      <NotificationTest />
    </div>
  );
};

export default Index;
