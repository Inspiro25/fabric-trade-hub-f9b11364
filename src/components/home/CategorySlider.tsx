import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const CategorySlider = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType>();

  // If on mobile, don't render the component
  if (isMobile) return null;

  // Expanded category data with icons
  const categories = [
    // Fashion & Accessories
    { name: "Fashion", icon: "👕", link: "/category/fashion" },
    { name: "Men's Wear", icon: "👔", link: "/category/mens-wear" },
    { name: "Women's Wear", icon: "👗", link: "/category/womens-wear" },
    { name: "Kids' Fashion", icon: "🧒", link: "/category/kids-fashion" },
    { name: "Shoes", icon: "👟", link: "/category/shoes" },
    { name: "Bags", icon: "👜", link: "/category/bags" },
    { name: "Jewelry", icon: "💍", link: "/category/jewelry" },
    { name: "Accessories", icon: "🧣", link: "/category/accessories" },

    // Electronics & Tech
    { name: "Electronics", icon: "📱", link: "/category/electronics" },
    { name: "Computers", icon: "💻", link: "/category/computers" },
    { name: "Smartphones", icon: "📱", link: "/category/smartphones" },
    { name: "Gaming", icon: "🎮", link: "/category/gaming" },
    { name: "Cameras", icon: "📸", link: "/category/cameras" },
    { name: "Audio", icon: "🎧", link: "/category/audio" },
    { name: "Smart Home", icon: "🏠", link: "/category/smart-home" },

    // Home & Living
    { name: "Home", icon: "🏠", link: "/category/home" },
    { name: "Furniture", icon: "🪑", link: "/category/furniture" },
    { name: "Kitchen", icon: "🍳", link: "/category/kitchen" },
    { name: "Bedding", icon: "🛏️", link: "/category/bedding" },
    { name: "Decor", icon: "🎭", link: "/category/decor" },
    { name: "Garden", icon: "🌱", link: "/category/garden" },
    { name: "Tools", icon: "🔧", link: "/category/tools" },

    // Beauty & Health
    { name: "Beauty", icon: "💄", link: "/category/beauty" },
    { name: "Skincare", icon: "🧴", link: "/category/skincare" },
    { name: "Haircare", icon: "💇‍♀️", link: "/category/haircare" },
    { name: "Health", icon: "💊", link: "/category/health" },
    { name: "Personal Care", icon: "🚿", link: "/category/personal-care" },
    { name: "Fragrances", icon: "🌸", link: "/category/fragrances" },

    // Sports & Leisure
    { name: "Sports", icon: "⚽", link: "/category/sports" },
    { name: "Fitness", icon: "🏋️‍♂️", link: "/category/fitness" },
    { name: "Outdoor", icon: "🏕️", link: "/category/outdoor" },
    { name: "Yoga", icon: "🧘‍♀️", link: "/category/yoga" },
    { name: "Cycling", icon: "🚲", link: "/category/cycling" },

    // Entertainment & Media
    { name: "Books", icon: "📚", link: "/category/books" },
    { name: "Music", icon: "🎵", link: "/category/music" },
    { name: "Movies", icon: "🎬", link: "/category/movies" },
    { name: "Art", icon: "🎨", link: "/category/art" },
    { name: "Hobbies", icon: "🎨", link: "/category/hobbies" },

    // Others
    { name: "Toys", icon: "🧸", link: "/category/toys" },
    { name: "Baby", icon: "👶", link: "/category/baby" },
    { name: "Pet Supplies", icon: "🐾", link: "/category/pet-supplies" },
    { name: "Office", icon: "💼", link: "/category/office" },
    { name: "Automotive", icon: "🚗", link: "/category/automotive" },
    { name: "Grocery", icon: "🛒", link: "/category/grocery" },
    { name: "Gifts", icon: "🎁", link: "/category/gifts" },
    { name: "Vintage", icon: "⌚", link: "/category/vintage" }
  ];

  return (
    <div className={cn(
      "py-4 border-b hidden md:block relative group w-screen -mx-[50vw] left-1/2 right-1/2",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
    )}>
      {/* Left Navigation Button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all",
          "opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0",
          isDarkMode 
            ? "bg-gray-800 hover:bg-gray-700 text-white" 
            : "bg-white hover:bg-gray-50 text-gray-700"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="px-12">
        <Swiper
          modules={[FreeMode, Navigation]}
          slidesPerView="auto"
          spaceBetween={24}
          freeMode={true}
          className="w-full"
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <Link 
                to={category.link}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  isDarkMode 
                    ? "hover:bg-gray-800" 
                    : "hover:bg-gray-50"
                )}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {category.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Navigation Button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all",
          "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0",
          isDarkMode 
            ? "bg-gray-800 hover:bg-gray-700 text-white" 
            : "bg-white hover:bg-gray-50 text-gray-700"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CategorySlider; 