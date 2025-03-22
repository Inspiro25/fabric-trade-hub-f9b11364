import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Sparkles, Clock, Heart, TrendingUp, Percent, Download, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import HomeHero from '@/components/home/HomeHero';
import ShopsSpotlight from '@/components/home/ShopsSpotlight';

const SectionLoading = () => <Skeleton className="h-32 w-full rounded-xl" />;
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));
const HomeCategoryGrid = lazy(() => import('@/components/home/HomeCategoryGrid'));
const HomeProductShowcase = lazy(() => import('@/components/home/HomeProductShowcase'));

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const FashionTrends = () => {
  const trends = [
    { id: 1, title: "Summer Essentials", image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=500&auto=format&fit=crop", color: "from-yellow-500/70" },
    { id: 2, title: "Athleisure", image: "https://images.unsplash.com/photo-1547941126-3d5322b218b0?q=80&w=500&auto=format&fit=crop", color: "from-blue-500/70" },
    { id: 3, title: "Office Ready", image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=500&auto=format&fit=crop", color: "from-purple-500/70" },
    { id: 4, title: "Weekend Casuals", image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=500&auto=format&fit=crop", color: "from-green-500/70" },
  ];
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-bold">Fashion Trends</h2>
          </div>
          <Link to="/trends" className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trends.map(trend => (
            <Link key={trend.id} to={`/trend/${trend.id}`} className="relative overflow-hidden rounded-xl group">
              <AspectRatio ratio={3/4} className="bg-gray-100">
                <img 
                  src={trend.image} 
                  alt={trend.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${trend.color} to-transparent opacity-70`}></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{trend.title}</h3>
                  <span className="text-white/80 text-sm flex items-center mt-1">
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </AspectRatio>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandsSpotlight = () => {
  const brands = [
    { id: 1, name: "Premium Active", logo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&auto=format&fit=crop&q=60" },
    { id: 2, name: "Luxe Street", logo: "https://images.unsplash.com/photo-1608541737042-87a12275d313?w=150&auto=format&fit=crop&q=60" },
    { id: 3, name: "Urban Edge", logo: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&auto=format&fit=crop&q=60" },
    { id: 4, name: "Elegance", logo: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=150&auto=format&fit=crop&q=60" },
    { id: 5, name: "Classic Fits", logo: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=150&auto=format&fit=crop&q=60" },
    { id: 6, name: "Seasonal", logo: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&auto=format&fit=crop&q=60" },
  ];
  
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Top Brands For You</h2>
          <p className="text-gray-500">Curated collections from premium brands</p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map(brand => (
            <Link key={brand.id} to={`/brand/${brand.id}`} className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center p-2 mb-2 hover:shadow-md transition-shadow">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="text-sm font-medium text-center">{brand.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppDownloadBanner = () => (
  <section className="py-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Download Our App</h2>
          <p className="mb-4">Get exclusive app-only offers and content</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <Download className="h-4 w-4 mr-2" />
              App Store
            </Button>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <Download className="h-4 w-4 mr-2" />
              Google Play
            </Button>
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&auto=format&fit=crop&q=60" 
          alt="Mobile App" 
          className="w-40 md:w-60 rounded-xl shadow-lg"
        />
      </div>
    </div>
  </section>
);

const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newMinutes -= 1;
          if (newMinutes < 0) {
            newHours -= 1;
            newMinutes = 59;
          }
          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: 59
          };
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="relative py-2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-95"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-5 right-5 w-10 h-10 bg-yellow-300/20 rounded-full blur-md"></div>
        <div className="absolute bottom-3 left-1/4 w-16 h-16 bg-rose-300/20 rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="md:w-auto flex items-center">
            <div className="mr-2 bg-white/20 backdrop-blur-sm p-1 rounded-full">
              <Flame className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center">
                FLASH SALE
                <Zap className="h-3 w-3 ml-1 text-yellow-300 animate-pulse" />
              </h2>
              <p className="text-white/80 text-[10px]">Ends soon!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="text-center">
              <div className="bg-white rounded-md p-0.5 w-8 font-mono font-bold text-xs text-rose-600 border-b-2 border-rose-300">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <span className="text-[8px] text-white font-medium mt-0.5 block">HRS</span>
            </div>
            <span className="text-xs font-bold text-white">:</span>
            <div className="text-center">
              <div className="bg-white rounded-md p-0.5 w-8 font-mono font-bold text-xs text-rose-600 border-b-2 border-rose-300">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-[8px] text-white font-medium mt-0.5 block">MIN</span>
            </div>
            <span className="text-xs font-bold text-white">:</span>
            <div className="text-center">
              <div className="bg-white rounded-md p-0.5 w-8 font-mono font-bold text-xs text-rose-600 border-b-2 border-rose-300">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-[8px] text-white font-medium mt-0.5 block">SEC</span>
            </div>
          </div>
          
          <Button size="sm" className="bg-white text-rose-600 hover:bg-rose-50 transition-colors shadow-md border-b-2 border-rose-200 font-bold text-xs py-0.5 px-2" asChild>
            <Link to="/flash-sale">
              SHOP NOW <Percent className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

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
  
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
    
    const timer = setTimeout(() => setIsPageLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && !categories.length) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="py-4 px-4 space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      
      <main className="pb-16">
        <HomeHero />
        
        <FlashSaleTimer />
        
        <AnimatedSection delay={0.1}>
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Popular Shops For You</h2>
                <p className="text-gray-500">Discover top-rated shops with great products</p>
              </div>
              
              <ShopsSpotlight />
            </div>
          </section>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2}>
          <div className="py-6">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Shop by Category</h2>
                </div>
                <Link to="/categories" className="text-orange-500 text-sm font-medium flex items-center hover:text-orange-600 transition-colors">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>}>
                <HomeCategoryGrid 
                  categories={categories} 
                  isLoading={!dataLoaded.categories} 
                />
              </Suspense>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <div className="container mx-auto px-4">
            {newArrivals.length > 0 && (
              <Suspense fallback={<SectionLoading />}>
                <HomeProductShowcase
                  title="New Arrivals"
                  subtitle="Fresh styles just landed"
                  products={newArrivals}
                  linkTo="/new-arrivals"
                  isLoaded={dataLoaded.newArrivals}
                  layout="carousel"
                  tag="new"
                />
              </Suspense>
            )}
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.4}>
          <FashionTrends />
        </AnimatedSection>
        
        <AnimatedSection delay={0.5}>
          <div className="py-6 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center mb-4">
                <Clock className="text-orange-500 mr-2 h-5 w-5" />
                <h2 className="text-xl font-bold">Deal of the Day</h2>
              </div>
              <Suspense fallback={<SectionLoading />}>
                <DealOfTheDay />
              </Suspense>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.6}>
          <div className="py-6">
            <div className="container mx-auto px-4">
              {bestSellers.length > 0 && (
                <Suspense fallback={<SectionLoading />}>
                  <HomeProductShowcase
                    title="Best Sellers"
                    subtitle="Our customers' favorites"
                    products={bestSellers}
                    linkTo="/category/best-sellers"
                    isLoaded={dataLoaded.bestSellers}
                    layout="carousel"
                    tag="trending"
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.7}>
          <AppDownloadBanner />
        </AnimatedSection>
        
        <AnimatedSection delay={0.8}>
          <div className="py-6">
            <div className="container mx-auto px-4">
              {topRatedProducts.length > 0 && (
                <Suspense fallback={<SectionLoading />}>
                  <HomeProductShowcase
                    title="Top Rated"
                    subtitle="Highly reviewed by our customers"
                    products={topRatedProducts}
                    linkTo="/category/top-rated"
                    isLoaded={dataLoaded.topRated}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.9}>
          <div className="py-6 bg-gray-50">
            <div className="container mx-auto px-4">
              {discountedProducts.length > 0 && (
                <Suspense fallback={<SectionLoading />}>
                  <HomeProductShowcase
                    title="Special Offers"
                    subtitle="Limited time deals you don't want to miss"
                    products={discountedProducts}
                    linkTo="/category/sale"
                    isLoaded={dataLoaded.discounted}
                    highlight={true}
                    tag="sale"
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Index;
