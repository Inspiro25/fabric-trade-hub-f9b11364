
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products/types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';

interface HomeNewArrivalsProps {
  products: Product[];
  isLoading?: boolean;
}

const HomeNewArrivals: React.FC<HomeNewArrivalsProps> = ({ products = [], isLoading = false }) => {
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Ensure that products is always an array, even if it's undefined
  const safeProducts = Array.isArray(products) ? products : [];
  
  if (safeProducts.length === 0) {
    return (
      <div className={cn(
        "text-center p-8 border rounded-lg",
        isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
      )}>
        No new arrivals available
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {safeProducts.slice(0, 4).map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          salePrice={product.sale_price}
          image={product.images?.[0] || ''}
          category={product.category || product.category_id}
          isNew={product.is_new}
          isTrending={product.is_trending}
          rating={product.rating}
          reviewCount={product.review_count}
        />
      ))}
    </div>
  );
};

export default HomeNewArrivals;
