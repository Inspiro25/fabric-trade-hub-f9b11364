
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HomeCategoriesProps {
  categories: string[];
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

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Pre-load all images
  useEffect(() => {
    const preloadImages = async () => {
      categories.forEach(category => {
        const img = new Image();
        img.src = getCategoryImage(category);
        img.onload = () => setLoadedImages(prev => ({ ...prev, [category]: true }));
        img.onerror = () => setImageErrors(prev => ({ ...prev, [category]: true }));
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
    return `https://placehold.co/100x100/orange/white?text=${encodeURIComponent(category)}`;
  };

  return (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Categories</h2>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.slice(0, 8).map((category, index) => (
          <Link 
            key={category} 
            to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
              <img 
                src={getCategoryImage(category)}
                alt={category}
                className="w-full h-full object-cover"
                onError={() => handleImageError(category)}
                loading="lazy"
              />
            </div>
            <span className="text-xs text-center font-medium">{category}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
