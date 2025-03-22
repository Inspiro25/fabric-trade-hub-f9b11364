
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

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

// Hero Banner Component
const EnhancedHero = () => {
  const { currentUser } = useAuth();
  
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
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
              New Collection
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
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 w-64 h-64 border border-white/20 rounded-full opacity-30" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/20 rounded-full opacity-20" />
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
        
        {/* Categories Grid */}
        <AnimatedSection delay={0.2}>
          <div className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Shop by Category</h2>
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
        
        {/* Deal of the Day - Elevated Design */}
        <AnimatedSection delay={0.3}>
          <div className="py-10">
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
        
        {/* New Arrivals */}
        <AnimatedSection delay={0.4}>
          <div className="bg-gradient-to-b from-orange-50 to-white py-10">
            <div className="container mx-auto px-4">
              {newArrivals.length > 0 && (
                <Suspense fallback={<SectionLoading />}>
                  <HomeProductShowcase
                    title="New Arrivals"
                    subtitle="Fresh styles just landed"
                    products={newArrivals}
                    linkTo="/new-arrivals"
                    isLoaded={dataLoaded.newArrivals}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Best Sellers with Enhanced Layout */}
        <AnimatedSection delay={0.5}>
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
                  />
                </Suspense>
              )}
            </div>
          </div>
        </AnimatedSection>
        
        {/* Top Rated */}
        <AnimatedSection delay={0.6}>
          <div className="bg-gray-50 py-10">
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
        <AnimatedSection delay={0.7}>
          <div className="py-10">
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
