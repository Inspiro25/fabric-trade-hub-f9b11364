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
import FlashSaleTimer from '@/components/home/FlashSaleTimer';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import ElectronicsShowcase from '@/components/home/ElectronicsShowcase';

const SectionLoading = () => <Skeleton className="h-32 w-full rounded-xl" />;
const DealOfTheDay = lazy(() => import('@/components/features/DealOfTheDay'));
const HomeCategoryGrid = lazy(() => import('@/components/home/HomeCategoryGrid'));
const HomeProductShowcase = lazy(() => import('@/components/home/HomeProductShowcase'));
const HomePromoBanner = lazy(() => import('@/components/home/HomePromoBanner'));

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
          {trends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={`/trend/${trend.id}`} className="relative overflow-hidden rounded-xl group block h-full">
                <AspectRatio ratio={3/4} className="bg-gray-100">
                  <img 
                    src={trend.image} 
                    alt={trend.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${trend.color} to-transparent opacity-70`}></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-white font-bold text-lg drop-shadow-md">{trend.title}</h3>
                    <span className="text-white/90 text-sm flex items-center mt-1 drop-shadow-md">
                      Explore
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="inline-block ml-1"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </motion.span>
                    </span>
                  </div>
                </AspectRatio>
              </Link>
            </motion.div>
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
    <section className="py-10 bg-gradient-to-b from-orange-50/80 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Top Brands For You</h2>
          <p className="text-gray-500">Curated collections from premium brands</p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
            >
              <Link to={`/brand/${brand.id}`} className="flex flex-col items-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center p-2 mb-2 hover:shadow-md transition-all group-hover:scale-105 duration-300">
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-sm font-medium text-center group-hover:text-orange-500 transition-colors">{brand.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ElectronicsShowcase = () => (
  <AnimatedGradient hue="orange" intensity="soft" className="py-10 rounded-xl mx-4">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 md:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Electronics & More</h2>
            <p className="mb-4 text-gray-600">Discover our wide range of electronics, home appliances, and other categories</p>
            <div className="flex gap-3">
              <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                <Link to="/category/electronics">
                  <Laptop className="h-4 w-4 mr-2" />
                  Shop Electronics
                </Link>
              </Button>
              <Button variant="outline" className="border-orange-200" asChild>
                <Link to="/category/smartphones">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Smartphones
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="overflow-hidden rounded-md mb-2">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300&auto=format&fit=crop" 
                alt="Laptop" 
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-sm">Laptops & Computers</h3>
            <p className="text-orange-500 text-xs flex items-center mt-1 group-hover:font-medium">
              Shop Now 
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="ml-1 h-3 w-3 group-hover:ml-2 transition-all" />
              </motion.span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="overflow-hidden rounded-md mb-2">
              <img 
                src="https://images.unsplash.com/photo-1546027658-7aa750153465?q=80&w=300&auto=format&fit=crop" 
                alt="Headphones" 
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-sm">Audio & Accessories</h3>
            <p className="text-orange-500 text-xs flex items-center mt-1 group-hover:font-medium">
              Shop Now 
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="ml-1 h-3 w-3 group-hover:ml-2 transition-all" />
              </motion.span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </AnimatedGradient>
);

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
      <div className="min-h-screen pt-16">
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
    <div className="min-h-screen">
      <AppHeader />
      
      <main className="pb-16 pt-2">
        <HomeHero />
        
        <FlashSaleTimer />
        
        <AnimatedSection delay={0.1}>
          <section className="py-10 bg-gradient-to-b from-orange-50/60 to-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold mb-2"
                >
                  Popular Shops For You
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500"
                >
                  Discover top-rated shops with great products
                </motion.p>
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
                  showViewAll={false}
                />
              </Suspense>
            )}
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.4}>
          <FashionTrends />
        </AnimatedSection>
        
        <AnimatedSection delay={0.5}>
          <div className="py-6 bg-gradient-to-b from-orange-50/30 to-white">
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
          <ElectronicsShowcase />
        </AnimatedSection>
        
        <AnimatedSection delay={0.8}>
          <div className="py-6">
            <div className="container mx-auto px-4">
              <Suspense fallback={<SectionLoading />}>
                <HomePromoBanner />
              </Suspense>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.9}>
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
        
        <AnimatedSection delay={1.0}>
          <div className="py-6 bg-gradient-to-b from-orange-50/40 to-white">
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
