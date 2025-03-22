
import React from 'react';
import { Tag } from 'lucide-react';

interface SearchCategoriesProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  if (categories.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium flex items-center mb-3">
        <Tag className="h-4 w-4 mr-2 text-gray-500" />
        Popular Categories
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700"
          >
            Clear
          </button>
        )}
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`text-sm rounded-full px-3 py-1 ${
              selectedCategory === category.id 
                ? 'bg-kutuku-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchCategories;
