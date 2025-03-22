
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';

interface ProductShowcaseProps {
  title: string;
  products: Product[];
  linkTo: string;
  isLoaded: boolean;
}

export default function HomeProductShowcase({ 
  title, 
  products, 
  linkTo,
  isLoaded 
}: ProductShowcaseProps) {
  if (!isLoaded) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to={linkTo} className="text-orange-600 text-sm font-medium flex items-center">
          See All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map(product => (
          <div key={product.id} className="transform transition-transform hover:-translate-y-1">
            <ProductCard 
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.images[0]}
              category={product.category}
              isNew={product.isNew}
              isTrending={product.isTrending}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
