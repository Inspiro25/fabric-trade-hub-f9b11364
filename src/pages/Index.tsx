
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Sparkles, Clock, Heart, TrendingUp, Percent, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Improved lazy loaded components
const SectionLoading = () => <Skeleton className="h-32 w-full rounded-xl" />;
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));
const HomeCategoryGrid = lazy(() => import('@/components/home/HomeCategoryGrid'));
const HomeProductShowcase = lazy(() => import('@/components/home/HomeProductShowcase'));

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Animated section component
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

// Fashion Trends Component - Myntra-like
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

// Brands Spotlight - Ajio-like
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

// App Download Banner - Common in fashion apps
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

// Hero Banner Component with fashion focus
const EnhancedHero = () => {
  const { currentUser } = useAuth();
  
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471&auto=format&fit=crop" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-white"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mb-4"
          >
            <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full px-3 py-1 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Summer Collection 2023
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Discover Your <span className="text-orange-400">Perfect Style</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white/80 mb-8 text-lg"
          >
            Explore our curated collections designed for comfort and elegance.
            {currentUser ? ` Welcome back, ${currentUser.displayName?.split(' ')[0] || 'valued customer'}!` : ''}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 gap-2 rounded-full" asChild>
              <Link to="/new-arrivals">
                <ShoppingBag className="h-4 w-4" />
                Shop New Arrivals
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" asChild>
              <Link to="/trending">
                <Star className="h-4 w-4 mr-2" />
                Trending Now
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Quick Shop Categories - Like Myntra/Ajio */}
      <div className="absolute bottom-5 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {['Women', 'Men', 'Kids', 'Beauty', 'Accessories', 'Footwear'].map(cat => (
              <Link 
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="bg-white/90 backdrop-blur-sm shadow-sm rounded-full px-4 py-2 flex items-center gap-2 flex-shrink-0 hover:bg-orange-50 transition-colors"
              >
                <span className="font-medium text-sm">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Flash Sale Timer - Ajio inspired
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
    <section className="bg-rose-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <Percent className="h-6 w-6 mr-2 text-rose-500" />
            <h2 className="text-2xl font-bold text-rose-600">FLASH SALE</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="bg-white rounded-md shadow-sm p-2 w-12 font-mono font-bold text-xl">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">HRS</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="text-center">
              <div className="bg-white rounded-md shadow-sm p-2 w-12 font-mono font-bold text-xl">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">MIN</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="text-center">
              <div className="bg-white rounded-md shadow-sm p-2 w-12 font-mono font-bold text-xl">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-xs">SEC</span>
            </div>
          </div>
          
          <Button className="bg-rose-500 hover:bg-rose-600 transition-colors" asChild>
            <Link to="/flash-sale">
              Shop Now <ArrowRight className="ml-1 h-4 w-4" />
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
    
    // Set page as loaded after a short delay for animations
    const timer = setTimeout(() => setIsPageLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Lightweight fallback loading state
  if (isLoading && !categories.length) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader />
        <div className="py-4 px-4 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
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
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content */}
      <main className="pb-16">
        {/* Enhanced Hero Section */}
        <EnhancedHero />
        
        {/* Flash Sale Timer - Ajio-like feature */}
        <FlashSaleTimer />
        
        {/* Brands Spotlight - Ajio-like */}
        <AnimatedSection delay={0.1}>
          <BrandsSpotlight />
        </AnimatedSection>
        
        {/* Categories Grid */}
        <AnimatedSection delay={0.2}>
          <div className="py-10">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Shop by Category</h2>
                </div>
                <Link to="/categories" className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors">
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
        
        {/* New Arrivals */}
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
        
        {/* Fashion Trends - Myntra-like section */}
        <AnimatedSection delay={0.4}>
          <FashionTrends />
        </AnimatedSection>
        
        {/* Deal of the Day - Elevated Design */}
        <AnimatedSection delay={0.5}>
          <div className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center mb-6">
                <Clock className="text-orange-500 mr-2 h-5 w-5" />
                <h2 className="text-2xl font-bold">Deal of the Day</h2>
              </div>
              <Suspense fallback={<SectionLoading />}>
                <DealOfTheDay />
              </Suspense>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Best Sellers with Enhanced Layout */}
        <AnimatedSection delay={0.6}>
          <div className="py-10">
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
        
        {/* App Download Banner - Common in fashion apps */}
        <AnimatedSection delay={0.7}>
          <AppDownloadBanner />
        </AnimatedSection>
        
        {/* Top Rated */}
        <AnimatedSection delay={0.8}>
          <div className="py-10">
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
        
        {/* On Sale with Special Styling */}
        <AnimatedSection delay={0.9}>
          <div className="py-10 bg-gray-50">
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
