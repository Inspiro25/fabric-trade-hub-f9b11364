
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, categoryToSlug } from '@/lib/utils';

interface HomeCategoriesProps {
  categories?: string[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

// Verified working image URLs with direct paths rather than API calls
const CategoryFallbackImages: Record<string, string> = {
  'Men': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&auto=format&fit=crop&q=60',
  'Women': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=60',
  'Kids': 'https://images.unsplash.com/photo-1543702303-111dc7087e2b?w=300&auto=format&fit=crop&q=60',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&auto=format&fit=crop&q=60',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=60',
  'Sportswear': 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&auto=format&fit=crop&q=60',
  'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=60',
  'Ethnic Wear': 'https://images.unsplash.com/photo-1583391733956-3772df1a232f?w=300&auto=format&fit=crop&q=60',
  'Western Wear': 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&auto=format&fit=crop&q=60',
  'Watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=60',
  'Jewelry': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=60',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&fit=crop&q=60',
  'Shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=60',
  'Pants': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&auto=format&fit=crop&q=60',
  'Dresses': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&auto=format&fit=crop&q=60',
  'Bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=60',
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&auto=format&fit=crop&q=60',
};

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories: propCategories }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesWithDetails();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Pre-load all images
  useEffect(() => {
    const preloadImages = async () => {
      categories.forEach(category => {
        const img = new Image();
        img.src = getCategoryImage(category.name);
        img.onload = () => setLoadedImages(prev => ({ ...prev, [category.name]: true }));
        img.onerror = () => setImageErrors(prev => ({ ...prev, [category.name]: true }));
      });
    };
    
    preloadImages();
  }, [categories]);

  const handleImageError = (category: string) => {
    console.log(`Image error for category: ${category}`);
    setImageErrors(prev => ({ ...prev, [category]: true }));
  };

  const getCategoryImage = (category: string) => {
    // First check for exact match
    if (CategoryFallbackImages[category]) {
      return CategoryFallbackImages[category];
    }
    
    // Then check case-insensitive
    const caseInsensitiveMatch = Object.keys(CategoryFallbackImages).find(
      key => key.toLowerCase() === category.toLowerCase()
    );
    
    if (caseInsensitiveMatch) {
      return CategoryFallbackImages[caseInsensitiveMatch];
    }
    
    // If no match, use placeholder
    return `https://placehold.co/100x100/blue/white?text=${encodeURIComponent(category)}`;
  };

  const handleCategoryClick = (category: Category) => {
    const slug = categoryToSlug(category.name);
    navigate(`/category/${slug}`);
  };

  if (categories.length === 0) return null;

  return (
    <section className={cn(
      "mb-6 px-4 py-4 rounded-lg",
      isDarkMode ? "bg-gray-800/70" : "bg-white shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={cn(
          "text-lg font-bold",
          isDarkMode ? "text-white" : "text-gray-800"
        )}>
          Categories
        </h2>
        <Link 
          to="/categories" 
          className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-blue-400" : "text-blue-500"
          )}
        >
          See All
        </Link>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.slice(0, 8).map((category) => (
          <div 
            key={category.id} 
            onClick={() => handleCategoryClick(category)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className={cn(
              "w-16 h-16 rounded-full overflow-hidden mb-2 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110", 
              isDarkMode 
                ? "border-2 border-gray-700 bg-gray-800/80 shadow-md" 
                : "border-2 border-white bg-gray-100/80 shadow-sm"
            )}>
              {category.image ? (
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(category.name)}
                  loading="lazy"
                />
              ) : (
                <img 
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(category.name)}
                  loading="lazy"
                />
              )}
            </div>
            <span className={cn(
              "text-xs text-center font-medium transition-colors",
              isDarkMode 
                ? "text-gray-300 group-hover:text-blue-400" 
                : "text-gray-700 group-hover:text-blue-500"
            )}>
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
