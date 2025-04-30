
import React from 'react';

interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

interface FeaturedCategoriesProps {
  categories: Category[];
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div 
          key={category.id} 
          className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
        >
          {category.image && (
            <div className="h-32 w-full flex items-center justify-center mb-2">
              <img 
                src={category.image} 
                alt={category.name} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <h3 className="text-lg font-semibold">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-500">{category.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeaturedCategories;
