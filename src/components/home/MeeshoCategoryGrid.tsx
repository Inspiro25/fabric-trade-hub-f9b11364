
import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/use-products-data';

const MeeshoCategoryGrid = () => {
  const { categories, isLoading, error } = useCategories();
  const { isDarkMode } = useTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-20 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "text-center py-8",
        isDarkMode ? "text-gray-300" : "text-gray-700"
      )}>
        Unable to load categories. Please try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-6">
      {categories.slice(0, 12).map((category) => (
        <Link 
          to={`/categories/${category.id}`} 
          key={category.id}
          className="flex flex-col items-center group"
        >
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105",
            isDarkMode 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-gradient-to-br from-purple-100 to-pink-100"
          )}>
            {category.image ? (
              <img 
                src={category.image} 
                alt={category.name} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <span className={cn(
                "text-2xl",
                isDarkMode ? "text-purple-300" : "text-purple-700"
              )}>
                {category.name.charAt(0)}
              </span>
            )}
          </div>
          
          <p className={cn(
            "mt-2 text-sm font-medium text-center",
            isDarkMode ? "text-gray-300" : "text-gray-800"
          )}>
            {category.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default MeeshoCategoryGrid;
