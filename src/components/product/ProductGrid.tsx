
import React from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/lib/products/types';
import { PaginationComponent } from '@/components/ui/pagination-custom';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showPagination?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  showViewToggle?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  showPagination = false,
  totalItems = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange = () => {},
  showViewToggle = false
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  // Calculate total pages
  const totalPages = Math.ceil((totalItems || products.length) / pageSize);
  
  return (
    <div className="space-y-6">
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      {showViewToggle && (
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            salePrice={product.sale_price}
            image={product.images[0]}
            category={product.category || product.category_id}
            rating={product.rating}
            reviewCount={product.review_count}
            isNew={product.is_new}
            isTrending={product.is_trending}
            layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
          />
        ))}
      </div>
      
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PaginationComponent
            currentPage={currentPage}
            totalItems={totalItems || products.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
