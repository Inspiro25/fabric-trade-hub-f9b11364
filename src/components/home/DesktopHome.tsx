
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import FeaturedCategories from './FeaturedCategories';
import HomeProductShowcase from './HomeProductShowcase';
import HeroCarousel from '@/components/ui/HeroCarousel';
import ProductSection from '@/components/features/ProductSection';
import DealOfTheDay from '@/components/features/DealOfTheDay';
import BrandsShowcase from '@/components/features/BrandsShowcase';
import NewCollectionBanner from '@/components/features/NewCollectionBanner';
import CustomerTestimonials from '@/components/features/CustomerTestimonials';
import Newsletter from '@/components/forms/Newsletter';
import { AllCategories, FeaturedProducts, PopularProducts } from '@/data/demo-products';

const DesktopHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div
      className={cn(
        "w-full min-h-screen flex flex-col",
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      )}
    >
      <HeroCarousel />
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <FeaturedCategories categories={AllCategories} />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <ProductSection
          title="Featured Products"
          subtitle="Handpicked selection just for you"
          viewAllLink="/products/featured"
          products={FeaturedProducts.slice(0, 6)}
        />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <DealOfTheDay />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <ProductSection
          title="Popular Products"
          subtitle="Best selling items this month"
          viewAllLink="/products/popular"
          products={PopularProducts.slice(0, 6)}
          titlePosition="right"
        />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <NewCollectionBanner />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <HomeProductShowcase />
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-8">
        <BrandsShowcase />
      </section>
      
      <section className={cn(
        "py-16",
        isDarkMode ? 'bg-gray-800' : 'bg-blue-50'
      )}>
        <div className="container mx-auto px-4 md:px-8">
          <CustomerTestimonials />
        </div>
      </section>
      
      <section className="container mx-auto px-4 md:px-8 py-16">
        <Newsletter />
      </section>
    </div>
  );
};

export default DesktopHome;
