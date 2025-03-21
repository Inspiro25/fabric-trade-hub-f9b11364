
import React from 'react';
import { Link } from 'react-router-dom';

interface HomeCategoriesProps {
  categories: string[];
}

const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
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
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm">
              <img 
                src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`}
                alt={category}
                className="w-full h-full object-cover"
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
