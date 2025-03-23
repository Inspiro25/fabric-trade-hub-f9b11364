
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { motion } from 'framer-motion';

interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface CategoryGridProps {
  categories: string[];
  isLoading: boolean;
}

// Fallback images with higher quality images
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  'Men': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60',
  'Women': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
  'Kids': 'https://images.unsplash.com/photo-1543702303-111dc7087e2b?w=500&auto=format&fit=crop&q=60',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
  'Sportswear': 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=500&auto=format&fit=crop&q=60',
  'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
};

export default function HomeCategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const [categoryDetails, setCategoryDetails] = useState<CategoryType[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const details = await getCategoriesWithDetails();
        setCategoryDetails(details);
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchCategoryDetails();
  }, []);

  const getCategoryImage = (categoryName: string) => {
    // First try to find the category in our detailed list
    const category = categoryDetails.find(cat => cat.name === categoryName);
    if (category && category.image) {
      return category.image;
    }
    
    // Fallback to our hardcoded images if we have one
    if (FALLBACK_CATEGORY_IMAGES[categoryName]) {
      return FALLBACK_CATEGORY_IMAGES[categoryName];
    }
    
    // Last resort, use a placeholder
    return `https://placehold.co/300x300/orange/white?text=${encodeURIComponent(categoryName)}`;
  };

  if (isLoading || isLoadingDetails) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-36 md:h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  // Prioritize categories from our database
  const displayCategories = categoryDetails.length > 0 
    ? categoryDetails.map(cat => cat.name) 
    : categories;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {displayCategories.slice(0, 8).map(category => (
        <motion.div 
          key={category} 
          variants={itemVariants}
          onMouseEnter={() => setHoveredCategory(category)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link 
            to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="relative overflow-hidden rounded-xl group block aspect-square"
          >
            <img 
              src={getCategoryImage(category)}
              alt={category}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
              <span className="text-white font-semibold text-lg md:text-xl">{category}</span>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: hoveredCategory === category ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
                className="h-1 bg-orange-400 mt-2"
              />
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: hoveredCategory === category ? 1 : 0,
                  y: hoveredCategory === category ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
                className="text-white/80 text-sm mt-1"
              >
                Explore Collection
              </motion.span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
