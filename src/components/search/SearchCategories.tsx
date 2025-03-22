
import React from 'react';
import { Tag, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SearchCategoriesProps {
  categories: { id: string; name: string; image?: string | null }[];
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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-medium flex items-center mb-3">
        <Tag className="h-4 w-4 mr-2 text-[#9b87f5]" />
        Popular Categories
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {selectedCategory && (
          <Button
            onClick={() => onSelectCategory(null)}
            className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 h-auto text-gray-700"
            variant="ghost"
            size="sm"
          >
            Clear
          </Button>
        )}
        
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onSelectCategory(category.id)}
              className={`text-sm rounded-full px-3 py-1 h-auto flex items-center gap-1 ${
                selectedCategory === category.id 
                  ? 'bg-[#9b87f5] text-white hover:bg-[#7E69AB]' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
            >
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-3 h-3 mr-1" />
              ) : (
                <Store className="h-3 w-3 mr-1" />
              )}
              {category.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchCategories;
