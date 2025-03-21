
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeCategoriesProps {
  categories: string[];
}

// Updated with more reliable image URLs
const CategoryFallbackImages: Record<string, string> = {
  'Men': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&auto=format&fit=crop&q=80',
  'Women': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'Kids': 'https://images.unsplash.com/photo-1543702303-111dc7087e2b?w=300&auto=format&fit=crop&q=80',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300&auto=format&fit=crop&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=80',
  'Sportswear': 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&auto=format&fit=crop&q=80',
  'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
  // Add more fallback images for any additional categories
  'Ethnic Wear': 'https://images.unsplash.com/photo-1583391733956-3772df1a232f?w=300&auto=format&fit=crop&q=80',
  'Western Wear': 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&auto=format&fit=crop&q=80',
  'Watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80',
  'Jewelry': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80',
};

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (category: string) => {
    setImageErrors(prev => ({ ...prev, [category]: true }));
  };

  const getCategoryImage = (category: string) => {
    // Always use the fallback image if available
    return CategoryFallbackImages[category] || `https://via.placeholder.com/100x100.png?text=${encodeURIComponent(category)}`;
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
            to={`/category/${category.toLowerCase()}`}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm bg-gray-100">
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
