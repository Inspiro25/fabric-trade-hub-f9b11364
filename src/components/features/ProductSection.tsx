
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/products/types';
import ProductCard from '@/components/ui/ProductCard';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo: string;
  viewAllLink?: string;
  titlePosition?: 'left' | 'right' | 'center';
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle,
  products, 
  linkTo,
  viewAllLink,
  titlePosition = 'left'
}) => {
  const { isDarkMode } = useTheme();
  const effectiveLinkTo = viewAllLink || linkTo;
  
  return (
    <section className={cn(
      "mb-6 px-4 py-3 rounded-lg",
      isDarkMode ? "bg-gray-800/50" : "bg-white shadow-sm"
    )}>
      <div className={cn(
        "flex items-center mb-3",
        titlePosition === 'left' ? "justify-between" : 
        titlePosition === 'right' ? "justify-between flex-row-reverse" : 
        "justify-center flex-col"
      )}>
        <div className={cn(
          titlePosition === 'center' && "text-center"
        )}>
          <h2 className={cn(
            "text-lg font-bold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              isDarkMode ? "text-gray-300" : "text-gray-500"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        <Link 
          to={effectiveLinkTo} 
          className={cn(
            "text-sm font-medium flex items-center",
            isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"
          )}
        >
          See All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map(product => {
          // Ensure the product has all required properties
          const enhancedProduct: Product = {
            ...product,
            category: product.category || '',
            reviewCount: product.reviewCount || product.review_count || 0,
            colors: product.colors || [],
            sizes: product.sizes || [],
            stock: product.stock || 0,
            tags: product.tags || []
          };
          
          return (
            <ProductCard 
              key={product.id}
              product={enhancedProduct}
            />
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(ProductSection);
