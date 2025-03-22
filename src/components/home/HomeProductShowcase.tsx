
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products';
import { ArrowRight, ArrowLeft, Truck, Timer, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo: string;
  isLoaded: boolean;
  layout?: 'grid' | 'carousel';
  highlight?: boolean;
  tag?: 'new' | 'sale' | 'trending';
}

export default function HomeProductShowcase({ 
  title, 
  subtitle,
  products, 
  linkTo,
  isLoaded,
  layout = 'grid',
  highlight = false,
  tag
}: ProductShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getBadgeText = () => {
    switch(tag) {
      case 'new': return 'NEW ARRIVALS';
      case 'sale': return 'SALE';
      case 'trending': return 'TRENDING';
      default: return null;
    }
  }

  const getBadgeColor = () => {
    switch(tag) {
      case 'new': return 'bg-emerald-500';
      case 'sale': return 'bg-rose-500';
      case 'trending': return 'bg-purple-500';
      default: return '';
    }
  }

  if (!isLoaded) {
    return (
      <div className="px-4 py-6">
        <div className="flex flex-col mb-6">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }
  
  // Render carousel layout
  if (layout === 'carousel') {
    return (
      <section ref={ref} className={cn(
        "py-8 relative",
        highlight ? "bg-gradient-to-b from-orange-50 to-white rounded-2xl p-6" : ""
      )}>
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                {tag && (
                  <Badge className={cn("text-xs font-semibold px-2", getBadgeColor())}>
                    {getBadgeText()}
                  </Badge>
                )}
              </div>
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <Link to={linkTo} className="text-orange-500 text-sm font-medium flex items-center hover:text-orange-600 transition-colors">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {highlight && (
            <div className="flex flex-wrap gap-4 mt-4 mb-6">
              <div className="flex items-center text-sm">
                <Truck className="h-4 w-4 text-orange-500 mr-1" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center text-sm">
                <Timer className="h-4 w-4 text-orange-500 mr-1" />
                <span>Limited Time Offers</span>
              </div>
              <div className="flex items-center text-sm">
                <Shield className="h-4 w-4 text-orange-500 mr-1" />
                <span>Quality Guarantee</span>
              </div>
            </div>
          )}
        </div>
        
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {products.map(product => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <motion.div 
                  className="p-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice}
                    image={product.images[0]}
                    category={product.category}
                    isNew={product.isNew}
                    isTrending={product.isTrending}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 bg-white" />
            <CarouselNext className="relative inset-0 translate-y-0 bg-white" />
          </div>
        </Carousel>

        {/* Decorative elements */}
        {highlight && (
          <>
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full border border-orange-200 opacity-50" />
            <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-orange-200 opacity-30" />
          </>
        )}
      </section>
    );
  }

  // Default grid layout with enhanced animations
  return (
    <section 
      ref={ref}
      className={cn(
        "py-8 relative",
        highlight ? "bg-gradient-to-b from-orange-50 to-white rounded-2xl p-6" : ""
      )}
    >
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{title}</h2>
              {tag && (
                <Badge className={cn("text-xs font-semibold px-2", getBadgeColor())}>
                  {getBadgeText()}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Link to={linkTo} className="text-orange-500 text-sm font-medium flex items-center hover:text-orange-600 transition-colors">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {products.slice(0, 4).map(product => (
          <motion.div 
            key={product.id} 
            variants={itemVariants}
            className="transform transition-all hover:-translate-y-1"
          >
            <ProductCard 
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.images[0]}
              category={product.category}
              isNew={product.isNew}
              isTrending={product.isTrending}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative elements */}
      {highlight && (
        <>
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full border border-orange-200 opacity-50" />
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-orange-200 opacity-30" />
        </>
      )}
    </section>
  );
}
