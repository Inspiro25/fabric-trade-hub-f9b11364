
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { getAllCategories } from '@/lib/products';

interface CategorySectionProps {
  className?: string;
}

const CategorySection = ({ className = '' }: CategorySectionProps) => {
  const categories = getAllCategories();

  return (
    <section className={`py-10 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Shop By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link 
              key={category} 
              to={`/category/${category.toLowerCase()}`}
              className="group"
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 mb-3 overflow-hidden">
                    <img
                      src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`}
                      alt={category}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{category}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
