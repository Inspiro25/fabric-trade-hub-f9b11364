
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';

interface HomeCategoriesProps {
  categories?: string[] | any[];
  isLoading?: boolean;
}

const HomeCategories: React.FC<HomeCategoriesProps> = ({ 
  categories = [], 
  isLoading = false 
}) => {
  const { isDarkMode } = useTheme();
  
  // Placeholder categories
  const placeholderCategories = [
    'Fashion', 'Electronics', 'Home', 'Beauty', 
    'Sports', 'Books', 'Toys', 'Jewelry'
  ];
  
  const displayCategories = categories.length > 0 ? categories : placeholderCategories;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Skeleton className="w-16 h-16 rounded-full mb-2" />
            <Skeleton className="w-16 h-4" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {displayCategories.slice(0, 8).map((category, index) => {
        const categoryName = typeof category === 'string' ? category : category.name;
        const categoryId = typeof category === 'string' ? category.toLowerCase() : category.id;
        
        return (
          <Link 
            key={index} 
            to={`/category/${categoryId}`}
            className="flex flex-col items-center group"
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors mb-2",
              isDarkMode && "bg-gray-800 group-hover:bg-gray-700"
            )}>
              <span className="text-2xl">
                {categoryName.charAt(0)}
              </span>
            </div>
            <span className={cn(
              "text-sm font-medium text-gray-700 group-hover:text-gray-900",
              isDarkMode && "text-gray-300 group-hover:text-white"
            )}>
              {categoryName}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default HomeCategories;
