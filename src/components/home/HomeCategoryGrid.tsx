
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoriesWithDetails } from '@/lib/products/categories';

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

// Fallback images if database image is missing
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  'Men': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&auto=format&fit=crop&q=60',
  'Women': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60',
  'Kids': 'https://images.unsplash.com/photo-1543702303-111dc7087e2b?w=300&auto=format&fit=crop&q=60',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&auto=format&fit=crop&q=60',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=60',
  'Sportswear': 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&auto=format&fit=crop&q=60',
  'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=60',
};

export default function HomeCategoryGrid({ categories, isLoading }: CategoryGridProps) {
  const [categoryDetails, setCategoryDetails] = useState<CategoryType[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

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
    return `https://placehold.co/100x100/orange/white?text=${encodeURIComponent(categoryName)}`;
  };

  if (isLoading || isLoadingDetails) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  // Prioritize categories from our database
  const displayCategories = categoryDetails.length > 0 
    ? categoryDetails.map(cat => cat.name) 
    : categories;

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayCategories.slice(0, 8).map(category => (
          <Link 
            key={category} 
            to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="relative overflow-hidden rounded-lg group h-24"
          >
            <img 
              src={getCategoryImage(category)}
              alt={category}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white font-medium text-center px-2">{category}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
