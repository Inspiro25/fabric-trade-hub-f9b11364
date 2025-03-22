
import React, { useEffect, useState } from 'react';
import { Tag, Store, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface SearchCategoriesProps {
  categories: { id: string; name: string; image?: string | null }[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({
  categories: propCategories,
  selectedCategory,
  onSelectCategory
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategoriesWithDetails();
        
        if (data && data.length > 0) {
          setCategories(data);
        } else if (propCategories.length > 0) {
          // Fallback to prop categories if no data from API
          setCategories(propCategories as Category[]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        if (propCategories.length > 0) {
          // Fallback to prop categories on error
          setCategories(propCategories as Category[]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [propCategories]);

  if (isLoading || categories.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Tag className="h-4 w-4 mr-2 text-orange-500" />
          Popular Categories
        </h3>
        
        <Button variant="link" className="text-orange-500 p-0 h-auto text-sm" asChild>
          <Link to="/categories">View All <ChevronRight className="h-3 w-3 ml-1" /></Link>
        </Button>
      </div>
      
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
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
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
