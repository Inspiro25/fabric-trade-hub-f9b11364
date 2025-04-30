import React from 'react';
import HomeHero from './HomeHero';
import ProductSection from '@/components/features/ProductSection';
import FeaturedCategories from './FeaturedCategories';
import HomeProductShowcase from './HomeProductShowcase';
import HeroCarousel from '@/components/ui/HeroCarousel';
import CategorySlider from './CategorySlider';
import FlashSaleTimer from './FlashSaleTimer';
import BrandsShowcase from '@/components/features/BrandsShowcase';
import NewCollectionBanner from '@/components/features/NewCollectionBanner';
import CustomerTestimonials from '@/components/features/CustomerTestimonials';
import Newsletter from '@/components/forms/Newsletter';
import { Product } from '@/lib/types/product';

// Mock data for demo products
const demoProducts: Product[] = Array(8).fill(null).map((_, i) => ({
  id: `product-${i}`,
  name: `Product ${i + 1}`,
  description: `Description for product ${i + 1}`,
  price: 29.99 + i * 10,
  salePrice: i % 3 === 0 ? 19.99 + i * 8 : undefined,
  images: [`https://placehold.co/300x300?text=Product${i+1}`],
  category: 'category-1',
  reviewCount: 15 + i,
  rating: 4.5,
  stock: 10 + i,
  shop_id: `shop-${i % 3}`,
  colors: [],  // Add required fields
  sizes: [],   // Add required fields
  tags: []     // Add required fields
}));

const DesktopHome: React.FC = () => {
  return (
    <div>
      <HomeHero />

      <div className="container mx-auto px-4 py-8">
        <FeaturedCategories />
        
        <ProductSection 
          title="New Arrivals" 
          linkTo="/new-arrivals"
          viewAllLink="/new-arrivals"
          subtitle="Check out our latest products"
          products={demoProducts.slice(0, 4)}
        />
        
        <div className="my-10">
          <HeroCarousel />
        </div>
        
        <CategorySlider />
        
        <FlashSaleTimer />
        
        <ProductSection
          title="Trending Now" 
          linkTo="/trending-now"
          viewAllLink="/trending-now"
          subtitle="Popular products this season"
          products={demoProducts.slice(4, 8)}
          titlePosition="right"
        />
        
        <div className="my-12">
          <BrandsShowcase />
        </div>
        
        <HomeProductShowcase
          title="Popular Products"
          products={demoProducts}
          isLoaded={true}
        />
        
        <div className="my-12">
          <NewCollectionBanner />
        </div>
        
        <div className="my-16">
          <CustomerTestimonials />
        </div>
        
        <div className="my-16">
          <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default DesktopHome;
