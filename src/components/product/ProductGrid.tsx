
import React from 'react';
import { Product } from '@/lib/products/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { PaginationComponent } from '@/components/ui/pagination';

interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
  showPagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const ProductGrid = ({
  products,
  className = '',
  columns = 4,
  showPagination = false,
  currentPage = 1,
  pageSize = 12,
  totalItems,
  onPageChange
}: ProductGridProps) => {
  
  const getColumnClass = () => {
    switch(columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };
  
  return (
    <div className={className}>
      <div className={`grid ${getColumnClass()} gap-4`}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            salePrice={product.sale_price}
            image={product.images[0]}
            category={product.category || product.category_id}
            isNew={product.is_new}
            isTrending={product.is_trending}
            rating={product.rating}
            reviewCount={product.review_count}
          />
        ))}
      </div>
      
      {showPagination && totalItems && totalItems > pageSize && (
        <div className="mt-6 flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
