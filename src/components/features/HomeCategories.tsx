
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeCategoriesProps {
  categories: string[];
}

const CategoryFallbackImages: Record<string, string> = {
  'Men': 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=60',
  'Women': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60',
  'Kids': 'https://images.unsplash.com/photo-1543702303-111dc7087e2b?w=500&auto=format&fit=crop&q=60',
  'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
  'Sportswear': 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=500&auto=format&fit=crop&q=60',
  'Home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60',
};

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (category: string) => {
    setImageErrors(prev => ({ ...prev, [category]: true }));
  };

  const getCategoryImage = (category: string) => {
    // If we have a fallback image for this category and either an error occurred or we want to prioritize the fallback
    if (CategoryFallbackImages[category]) {
      return CategoryFallbackImages[category];
    }
    
    // Use Unsplash with a specific query that works better for fashion categories
    return `https://source.unsplash.com/300x300/?${category.toLowerCase()},fashion`;
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
