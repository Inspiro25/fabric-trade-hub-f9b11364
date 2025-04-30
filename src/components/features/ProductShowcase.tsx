import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/lib/products/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo?: string;
  isLoaded?: boolean;
  layout?: 'grid' | 'carousel' | 'featured';
  highlight?: boolean;
  tag?: string;
  showViewAll?: boolean;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  subtitle,
  products,
  linkTo = '/',
  isLoaded = false,
  layout = 'grid',
  highlight = false,
  tag,
  showViewAll = true,
}) => {
  const isLoading = !isLoaded;

  return (
    <section className="mb-8">
      <div className="md:flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Link to={linkTo}>
            <Button size="sm" variant="secondary" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/5] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductShowcase;
