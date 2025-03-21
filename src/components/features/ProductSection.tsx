
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  linkTo: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, linkTo }) => {
  return (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to={linkTo} className="text-kutuku-primary text-sm font-medium flex items-center">
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
