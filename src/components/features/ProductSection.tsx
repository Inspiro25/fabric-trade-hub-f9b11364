
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ProductSectionProps {
  title: string;
  products: Product[];
  linkTo: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, linkTo }) => {
  const { isDarkMode, primaryColor, textColor, mutedTextColor } = useTheme();
  
  return (
    <section className={cn(
      "mb-6 px-4 py-3 rounded-lg",
      isDarkMode ? "bg-gray-800/50" : "bg-white"
    )}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={cn(
          "text-lg font-bold",
          isDarkMode ? "text-white" : "text-gray-800"
        )}>
          {title}
        </h2>
        <Link 
          to={linkTo} 
          className={cn(
            "text-sm font-medium flex items-center",
            isDarkMode ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"
          )}
        >
          See All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            variant="compact"
            gridCols={2}
          />
        ))}
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
