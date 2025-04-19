import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
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
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { updateVyomaClothingImages } from '@/lib/supabase/products';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHome from '@/components/mobile/MobileHome';

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
  
  const { isDarkMode } = useTheme();
  
  return (
    <section className={cn(
      "py-10 px-4 rounded-xl",
      isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-b from-blue-50/60 to-white"
    )}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn(
              "h-5 w-5",
              isDarkMode ? "text-blue-400" : "text-blue-500"
            )} />
            <h2 className={cn(
              "text-2xl font-bold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Fashion Trends
            </h2>
          </div>
          <Link to="/trends" className={cn(
            "font-medium flex items-center transition-colors",
            isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
          )}>
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
                <AspectRatio ratio={3/4} className={cn(
                  "overflow-hidden",
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                )}>
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
  
  const { isDarkMode } = useTheme();
  
  return (
    <section className={cn(
      "py-10 rounded-xl",
      isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-b from-blue-50/80 to-white"
    )}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            Top Brands For You
          </h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            Curated collections from premium brands
          </p>
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
                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center p-2 mb-2 transition-all group-hover:scale-105 duration-300",
                  isDarkMode 
                    ? "bg-gray-700 shadow-md hover:shadow-lg" 
                    : "bg-white shadow-sm hover:shadow-md"
                )}>
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className={cn(
                  "text-sm font-medium text-center transition-colors",
                  isDarkMode 
                    ? "text-gray-300 group-hover:text-blue-400" 
                    : "group-hover:text-blue-500"
                )}>
                  {brand.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { 
    categoriesQuery,
    productsInfiniteQuery,
    newArrivalsQuery,
    bestSellersQuery,
    topRatedQuery,
    discountedQuery,
    dataLoaded 
  } = useHomeData();

  // Add proper null checks and default values
  const topRatedProducts = topRatedQuery?.data || [];
  const categories = categoriesQuery?.data || [];
  const bestSellers = bestSellersQuery?.data || [];
  const discountedProducts = discountedQuery?.data || [];
  
  // Add isDarkMode from useTheme
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-b from-blue-50/60 to-white"
    )}>
      <main>
        <HomeHero />
        
        <FlashSaleTimer />
        
        <AnimatedSection delay={0.1}>
          <section className={cn(
            "py-10",
            isDarkMode ? "bg-gradient-to-b from-gray-800/60 to-gray-900" : "bg-gradient-to-b from-blue-50/60 to-white"
          )}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "text-2xl font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}
                >
                  Popular Shops For You
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
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
                  <h2 className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}>
                    Shop by Category
                  </h2>
                </div>
                <Link to="/categories" className={cn(
                  "text-sm font-medium flex items-center transition-colors",
                  isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
                )}>
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className={cn(
                    "h-32 rounded-xl", 
                    isDarkMode ? "bg-gray-800" : "bg-gray-200"
                  )} />
                ))}
              </div>}>
                <HomeCategoryGrid 
                  categories={categories} 
                />
              </Suspense>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.3}>
          <div className="py-6">
            <div className="container mx-auto px-4">
              {newArrivalsQuery.data && newArrivalsQuery.data.length > 0 && (
                <Suspense fallback={<SectionLoading />}>
                  <HomeProductShowcase
                    title="New Arrivals"
                    subtitle="Fresh styles just landed"
                    products={newArrivalsQuery.data}
                    linkTo="/new-arrivals"
                    isLoaded={dataLoaded.newArrivals}
                    layout="carousel"
                    tag="new"
                    showViewAll={false}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={0.4}>
          <FashionTrends />
        </AnimatedSection>
        
        <AnimatedSection delay={0.5}>
          <div className={cn(
            "py-4 rounded-xl mx-4",
            isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-b from-blue-50/30 to-white"
          )}>
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center mb-3">
                <Clock className={cn(
                  "mr-2 h-4 w-4",
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                )} />
                <h2 className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}>
                  Deal of the Day
                </h2>
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
          <div className={cn(
            "py-6 mx-4 rounded-xl",
            isDarkMode ? "bg-gray-800/50" : "bg-gradient-to-b from-blue-50/40 to-white"
          )}>
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

// Keep only one default export
const Home = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome /> : <Index />;
};

export default Home;
