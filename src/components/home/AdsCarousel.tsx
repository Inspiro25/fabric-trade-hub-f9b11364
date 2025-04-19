import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const AdsCarousel = () => {
  const { isDarkMode } = useTheme();

  // Sample advertisement data
  const ads = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      title: "Summer Collection",
      subtitle: "Up to 50% off on selected items",
      link: "/summer-sale",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1607082349566-18730285dd12?q=80&w=2070&auto=format&fit=crop",
      title: "New Arrivals",
      subtitle: "Discover the latest trends",
      link: "/new-arrivals",
      buttonText: "Explore"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1607082349566-18730285dd12?q=80&w=2070&auto=format&fit=crop",
      title: "Flash Deals",
      subtitle: "Limited time offers",
      link: "/flash-deals",
      buttonText: "View Deals"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1607082349566-18730285dd12?q=80&w=2070&auto=format&fit=crop",
      title: "Premium Brands",
      subtitle: "Exclusive collections",
      link: "/premium-brands",
      buttonText: "Discover"
    }
  ];

  return (
    <section className={cn(
      "py-12",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ 
            delay: 3000,
            disableOnInteraction: false
          }}
          loop={true}
          className="w-full rounded-lg overflow-hidden"
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad.id}>
              <div className="relative">
                <div className="aspect-[16/9] w-full">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                </div>
                <motion.div 
                  className="absolute inset-0 flex items-center px-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="max-w-md">
                    <h2 className={cn(
                      "text-3xl font-bold mb-2",
                      isDarkMode ? "text-white" : "text-white"
                    )}>
                      {ad.title}
                    </h2>
                    <p className={cn(
                      "text-lg mb-4",
                      isDarkMode ? "text-gray-300" : "text-gray-200"
                    )}>
                      {ad.subtitle}
                    </p>
                    <Link 
                      to={ad.link}
                      className={cn(
                        "inline-block px-6 py-2 rounded-full font-medium",
                        isDarkMode 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-white hover:bg-white/90 text-gray-900"
                      )}
                    >
                      {ad.buttonText}
                    </Link>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default AdsCarousel; 