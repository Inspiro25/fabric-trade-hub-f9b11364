
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products/types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';

interface HomeFlashSaleProps {
  products: Product[];
  isLoading?: boolean;
}

const HomeFlashSale: React.FC<HomeFlashSaleProps> = ({ products = [], isLoading = false }) => {
  const { isDarkMode } = useTheme();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
  
  // Filter only products with sale_price
  const saleProducts = safeProducts.filter(product => product.sale_price);
  
  if (saleProducts.length === 0) {
    return (
      <div className={cn(
        "text-center p-8 border rounded-lg",
        isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
      )}>
        No flash sale products available
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {saleProducts.slice(0, 4).map(product => (
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
          highlight="SALE"
        />
      ))}
    </div>
  );
};

export default HomeFlashSale;
