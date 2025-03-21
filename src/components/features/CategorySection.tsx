
import { useState, useEffect } from 'react';
import { getAllCategories } from '@/lib/products';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list';
  showAll?: boolean;
}

const CategorySection = ({
  title = "Shop by Category",
  subtitle = "Browse our full collection by category",
  layout = 'grid',
  showAll = true
}: CategorySectionProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse p-8">
        <div className="h-8 bg-gray-200 rounded-md mb-4 w-1/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded-md mb-8 w-2/3 mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <section className="py-12 px-4">
      {title && <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>}
      {subtitle && <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">{subtitle}</p>}
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link 
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="group relative h-40 overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-medium">{category}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(category => (
            <Link 
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors"
            >
              <span>{category}</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          ))}
        </div>
      )}
      
      {showAll && (
        <div className="text-center mt-10">
          <Link 
            to="/categories"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View all categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
