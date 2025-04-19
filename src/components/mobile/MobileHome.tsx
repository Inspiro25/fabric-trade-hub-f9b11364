import React, { Suspense, useEffect, useState } from 'react';
import { useHomeData } from '@/hooks/use-home-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Bell, ShoppingCart, Menu, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const MobileHome = () => {
  const { 
    categoriesQuery,
    newArrivalsQuery,
    bestSellersQuery,
    topRatedQuery,
    discountedQuery,
    dataLoaded 
  } = useHomeData();

  const categories = categoriesQuery?.data || [];
  const newArrivals = newArrivalsQuery?.data || [];
  const bestSellers = bestSellersQuery?.data || [];
  const topRated = topRatedQuery?.data || [];
  const discounted = discountedQuery?.data || [];
  
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Banner images for carousel
  const banners = [
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
  ];

  // Banner content for overlay
  const bannerContent = [
    { title: "Summer Collection", subtitle: "Up to 40% off", cta: "Shop Now" },
    { title: "Elegant Styles", subtitle: "For every occasion", cta: "Explore" },
    { title: "Fashion Week", subtitle: "Exclusive designs", cta: "Discover" },
    { title: "New Season", subtitle: "Fresh arrivals daily", cta: "View All" }
  ];
// Category icons for Flipkart-style category row
const categoryIcons = [
    { name: "Fashion", icon: "👕", color: "bg-blue-100" },
    { name: "Electronics", icon: "📱", color: "bg-green-100" },
    { name: "Home", icon: "🏠", color: "bg-yellow-100" },
    { name: "Beauty", icon: "💄", color: "bg-blue-100" },
    { name: "Toys", icon: "🧸", color: "bg-purple-100" },
    { name: "Grocery", icon: "🛒", color: "bg-blue-100" },
    { name: "Sports", icon: "⚽", color: "bg-red-100" },
    { name: "Books", icon: "📚", color: "bg-indigo-100" },
    { name: "Appliances", icon: "🔌", color: "bg-teal-100" },
    { name: "Furniture", icon: "🪑", color: "bg-amber-100" }
  ];
  return (
    <div className={cn(
      "pb-16",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Banner carousel */}
      <div className="mt-2">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          className="w-full"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="relative">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={banner} 
                    alt={`Banner ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                </AspectRatio>
                <motion.div 
                  className="absolute bottom-0 left-0 p-4 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">{bannerContent[index].title}</h2>
                  <p className="text-sm text-white/90 mt-1 drop-shadow-md">{bannerContent[index].subtitle}</p>
                  <Button 
                    className="mt-3 bg-white text-black hover:bg-white/90 px-4 py-1 h-8 rounded-full text-sm font-medium"
                    size="sm"
                  >
                    {bannerContent[index].cta}
                  </Button>
                </motion.div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-500 px-3 py-1 text-white">
                    TRENDING
                  </Badge>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Category icons row (scrollable) */}
      <div className="mt-4 px-2">
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-3 px-2">
            {categoryIcons.map((cat, index) => (
              <Link 
                key={index} 
                to={`/category/${cat.name.toLowerCase()}`}
                className="flex flex-col items-center"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-1",
                  cat.color
                )}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <span className={cn(
                  "text-xs font-medium text-center",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flash deals section */}
      <div className="mt-4 px-4">
        <div className={cn(
          "rounded-lg p-3",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className={cn(
                "text-lg font-bold",
                isDarkMode ? "text-white" : "text-gray-800"
              )}>
                Flash Deals
              </span>
              <Badge className="ml-2 bg-red-500">LIVE</Badge>
            </div>
            <Link to="/offers" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3">
              {discounted.slice(0, 6).map((product, index) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="min-w-[120px] max-w-[120px]"
                >
                  <div className="relative">
                    <AspectRatio ratio={1/1} className="rounded-md overflow-hidden">
                      <img 
                        src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <Badge className="absolute top-1 right-1 bg-red-500">
                      {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
                    </Badge>
                  </div>
                  <div className="mt-1">
                    <h3 className={cn(
                      "text-sm font-medium truncate",
                      isDarkMode ? "text-white" : "text-gray-800"
                    )}>
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={cn(
                        "text-sm font-bold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        ₹{product.salePrice}
                      </span>
                      <span className="text-xs line-through text-gray-500 ml-1">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New arrivals section */}
      <div className="mt-4 px-4">
        <div className={cn(
          "rounded-lg p-3",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "text-lg font-bold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              New Arrivals
            </span>
            <Link to="/new-arrivals" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <div className="relative">
                  <AspectRatio ratio={1/1} className="rounded-md overflow-hidden">
                    <img 
                      src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <Badge className="absolute top-1 right-1 bg-green-500">NEW</Badge>
                </div>
                <div className="mt-1">
                  <h3 className={cn(
                    "text-sm font-medium truncate",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}>
                    {product.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={cn(
                      "text-sm font-bold",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Best sellers section */}
      <div className="mt-4 px-4">
        <div className={cn(
          "rounded-lg p-3",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "text-lg font-bold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Best Sellers
            </span>
            <Link to="/category/best-sellers" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-3">
              {bestSellers.slice(0, 6).map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="min-w-[120px] max-w-[120px]"
                >
                  <AspectRatio ratio={1/1} className="rounded-md overflow-hidden">
                    <img 
                      src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="mt-1">
                    <h3 className={cn(
                      "text-sm font-medium truncate",
                      isDarkMode ? "text-white" : "text-gray-800"
                    )}>
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className={cn(
                        "text-sm font-bold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top rated products */}
      <div className="mt-4 px-4">
        <div className={cn(
          "rounded-lg p-3",
          isDarkMode ? "bg-gray-800" : "bg-white"
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "text-lg font-bold",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              Top Rated
            </span>
            <Link to="/category/top-rated" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {topRated.slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <AspectRatio ratio={1/1} className="rounded-md overflow-hidden">
                  <img 
                    src={product.images?.[0] || 'https://placehold.co/200x200?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <div className="mt-1">
                  <h3 className={cn(
                    "text-sm font-medium truncate",
                    isDarkMode ? "text-white" : "text-gray-800"
                  )}>
                    {product.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={cn(
                      "text-sm font-bold",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      ₹{product.price}
                    </span>
                    <div className="flex items-center ml-2">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs ml-0.5">{product.rating || 4.5}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Remove the jsx attribute from the style tag */}
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default MobileHome;