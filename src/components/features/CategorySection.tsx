
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAllCategories } from '@/lib/products';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategorySectionProps {
  className?: string;
}

const CategorySection = ({ className = '' }: CategorySectionProps) => {
  const categories = getAllCategories();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ScrollArea className="w-full">
        <div className="flex space-x-2 py-4 px-4 border-b bg-white">
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/category/${category.toLowerCase()}`}
              className="flex flex-col items-center min-w-[60px] group"
            >
              <div className="w-10 h-10 rounded-full mb-1 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`}
                  alt={category}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <span className="text-xs text-center line-clamp-1">{category}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <section className={`py-6 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl font-bold text-center mb-4">Shop By Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/category/${category.toLowerCase()}`}
              className="group"
            >
              <div className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-lg flex flex-col items-center p-2">
                <div className="w-12 h-12 rounded-full bg-muted/50 mb-2 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`}
                    alt={category}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                  />
                </div>
                <span className="text-xs font-medium text-center line-clamp-1">{category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
