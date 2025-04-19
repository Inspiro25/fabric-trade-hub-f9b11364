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
import { useTheme } from '@/contexts/ThemeContext';

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo?: string;
  isLoaded: boolean;
  layout?: 'grid' | 'carousel';
  highlight?: boolean;
  tag?: 'new' | 'sale' | 'trending';
  showViewAll?: boolean;
}

export default function HomeProductShowcase({ 
  title, 
  subtitle,
  products, 
  linkTo,
  isLoaded,
  layout = 'grid',
  highlight = false,
  tag,
  showViewAll = true
}: ProductShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { isDarkMode } = useTheme();
  
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
      case 'new': return isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500';
      case 'sale': return isDarkMode ? 'bg-rose-600' : 'bg-rose-500';
      case 'trending': return isDarkMode ? 'bg-purple-600' : 'bg-purple-500';
      default: return '';
    }
  }

  if (!isLoaded) {
    return (
      <div className="px-4 py-6">
        <div className="flex flex-col mb-6">
          <Skeleton className={cn(
            "h-8 w-40 mb-2", 
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )} />
          <Skeleton className={cn(
            "h-4 w-60", 
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className={cn(
              "h-64 rounded-xl", 
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
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
        "py-8 relative px-4 rounded-xl",
        highlight ? (
          isDarkMode 
            ? "bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700" 
            : "bg-gradient-to-b from-orange-50 to-white shadow-sm border border-orange-100"
        ) : ""
      )}>
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className={cn(
                  "text-2xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}>
                  {title}
                </h2>
                {tag && (
                  <Badge className={cn("text-xs font-semibold px-2", getBadgeColor())}>
                    {getBadgeText()}
                  </Badge>
                )}
              </div>
              {subtitle && <p className={cn(
                "mt-1",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {subtitle}
              </p>}
            </div>
            {showViewAll && linkTo && (
              <Link to={linkTo} className={cn(
                "text-sm font-medium flex items-center transition-colors",
                isDarkMode 
                  ? "text-blue-400 hover:text-blue-300" 
                  : "text-blue-500 hover:text-blue-600"
              )}>
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
          
          {highlight && (
            <div className="flex flex-wrap gap-4 mt-4 mb-6">
              <div className={cn(
                "flex items-center text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                <Truck className={cn(
                  "h-4 w-4 mr-1",
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                )} />
                <span>Free Shipping</span>
              </div>
              <div className={cn(
                "flex items-center text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                <Timer className={cn(
                  "h-4 w-4 mr-1",
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                )} />
                <span>Limited Time Offers</span>
              </div>
              <div className={cn(
                "flex items-center text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                <Shield className={cn(
                  "h-4 w-4 mr-1",
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                )} />
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
            <CarouselPrevious className={cn(
              "relative inset-0 translate-y-0",
              isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white hover:bg-gray-100"
            )} />
            <CarouselNext className={cn(
              "relative inset-0 translate-y-0",
              isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white hover:bg-gray-100"
            )} />
          </div>
        </Carousel>

        {/* Decorative elements */}
        {highlight && (
          <>
            <div className={cn(
              "absolute top-10 right-10 w-20 h-20 rounded-full border opacity-50",
              isDarkMode ? "border-gray-600" : "border-blue-200"
            )} />
            <div className={cn(
              "absolute bottom-10 left-10 w-32 h-32 rounded-full border opacity-30",
              isDarkMode ? "border-gray-600" : "border-blue-200"
            )} />
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
        "py-8 relative px-4 rounded-xl",
        highlight ? (
          isDarkMode 
            ? "bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700" 
            : "bg-gradient-to-b from-orange-50 to-white shadow-sm border border-orange-100"
        ) : ""
      )}
    >
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-800"
              )}>
                {title}
              </h2>
              {tag && (
                <Badge className={cn("text-xs font-semibold px-2", getBadgeColor())}>
                  {getBadgeText()}
                </Badge>
              )}
            </div>
            {subtitle && <p className={cn(
              "mt-1",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {subtitle}
            </p>}
          </div>
          {showViewAll && linkTo && (
            <Link to={linkTo} className={cn(
              "text-sm font-medium flex items-center transition-colors",
              isDarkMode 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-blue-500 hover:text-blue-600"
            )}>
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
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
          <div className={cn(
            "absolute top-10 right-10 w-20 h-20 rounded-full border opacity-50",
            isDarkMode ? "border-gray-600" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute bottom-10 left-10 w-32 h-32 rounded-full border opacity-30",
            isDarkMode ? "border-gray-600" : "border-blue-200"
          )} />
        </>
      )}
    </section>
  );
}
