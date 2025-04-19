import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

const HomeHero = () => {
  const { isDarkMode } = useTheme();

  // Sample advertisement data with high-quality fashion images
  const ads = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "Summer Collection 2024",
      subtitle: "Discover the latest trends in summer fashion",
      buttonText: "Shop Collection",
      link: "/summer-collection"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: "Luxury Accessories",
      subtitle: "Elevate your style with premium accessories",
      buttonText: "Explore Now",
      link: "/accessories"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
      title: "Designer Brands",
      subtitle: "Up to 40% off on selected brands",
      buttonText: "View Deals",
      link: "/brands"
    }
  ];

  return (
    <>
      <div className={cn(
        "relative w-full overflow-hidden",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          effect="fade"
          loop={true}
          className="w-full"
        >
          {ads.map((ad) => (
            <SwiperSlide key={ad.id}>
              <Link to={ad.link} className="block relative">
                <div className="relative aspect-[21/9] md:aspect-[3/1]">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={cn(
                    "absolute inset-0",
                    isDarkMode
                      ? "bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent"
                      : "bg-gradient-to-r from-white/90 via-white/50 to-transparent"
                  )} />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-xl"
                  >
                    <h2 className={cn(
                      "text-3xl md:text-4xl lg:text-5xl font-bold mb-4",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {ad.title}
                    </h2>
                    <p className={cn(
                      "text-lg md:text-xl mb-6",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      {ad.subtitle}
                    </p>
                    <button className={cn(
                      "px-6 py-3 rounded-full font-medium transition-colors",
                      isDarkMode
                        ? "bg-white text-gray-900 hover:bg-gray-100"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    )}>
                      {ad.buttonText}
                    </button>
                  </motion.div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HomeHero;
