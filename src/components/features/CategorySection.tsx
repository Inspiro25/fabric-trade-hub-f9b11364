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
    <section className="py-6 px-4 md:py-8">
      {title && (
        <h2 className={cn(
          "text-2xl md:text-2xl font-bold text-center mb-1",
          isDarkMode && "text-white"
        )}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn(
          "text-sm text-center mb-6 max-w-2xl mx-auto",
          isDarkMode ? "text-gray-300" : "text-gray-500"
        )}>
          {subtitle}
        </p>
      )}
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "group relative h-28 md:h-32 overflow-hidden rounded-lg transition-all cursor-pointer",
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
                <span className="text-sm md:text-base font-medium text-white text-center px-2">{category.name}</span>
              </div>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                isDarkMode ? "bg-orange-600" : "bg-primary"
              )}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                isDarkMode 
                  ? "border-gray-700 hover:border-orange-600" 
                  : "border-gray-200 hover:border-primary"
              )}
            >
              <span className={cn(
                "text-sm",
                isDarkMode ? "text-white" : ""
              )}>{category.name}</span>
              <ArrowRight className={cn(
                "h-3 w-3",
                isDarkMode ? "text-orange-500" : "text-primary"
              )} />
            </div>
          ))}
        </div>
      )}
      
      {showAll && (
        <div className="text-center mt-6">
          <Link 
            to="/categories"
            className={cn(
              "inline-flex items-center text-sm font-medium",
              isDarkMode 
                ? "text-orange-500 hover:text-orange-400" 
                : "text-primary hover:text-primary/80"
            )}
          >
            View all categories
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
