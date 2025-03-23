
import { useState, useEffect } from 'react';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, categoryToSlug } from '@/lib/utils';

interface CategorySectionProps {
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list';
  showAll?: boolean;
}

interface CategoryType {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

const CategorySection = ({
  title = "Shop by Category",
  subtitle = "Browse our full collection by category",
  layout = 'grid',
  showAll = true
}: CategorySectionProps) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategoriesWithDetails();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleCategoryClick = (category: CategoryType) => {
    const slug = categoryToSlug(category.name);
    navigate(`/category/${slug}`);
  };
  
  if (isLoading) {
    return (
      <div className={cn(
        "animate-pulse p-8",
        isDarkMode && "text-white"
      )}>
        <div className={cn(
          "h-8 rounded-md mb-4 w-1/3 mx-auto",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )}></div>
        <div className={cn(
          "h-4 rounded-md mb-8 w-2/3 mx-auto",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )}></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-24 rounded-lg",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )}
            ></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <section className="py-12 px-4">
      {title && (
        <h2 className={cn(
          "text-3xl font-bold text-center mb-2",
          isDarkMode && "text-white"
        )}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn(
          "text-center mb-10 max-w-2xl mx-auto",
          isDarkMode ? "text-gray-300" : "text-gray-500"
        )}>
          {subtitle}
        </p>
      )}
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "group relative h-40 overflow-hidden rounded-lg transition-all cursor-pointer",
                isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              {category.image && (
                <img 
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <span className="text-lg font-medium text-white">{category.name}</span>
              </div>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                isDarkMode ? "bg-orange-600" : "bg-primary"
              )}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer",
                isDarkMode 
                  ? "border-gray-700 hover:border-orange-600" 
                  : "border-gray-200 hover:border-primary"
              )}
            >
              <span className={isDarkMode ? "text-white" : ""}>{category.name}</span>
              <ArrowRight className={cn(
                "h-4 w-4",
                isDarkMode ? "text-orange-500" : "text-primary"
              )} />
            </div>
          ))}
        </div>
      )}
      
      {showAll && (
        <div className="text-center mt-10">
          <Link 
            to="/categories"
            className={cn(
              "inline-flex items-center font-medium",
              isDarkMode 
                ? "text-orange-500 hover:text-orange-400" 
                : "text-primary hover:text-primary/80"
            )}
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
