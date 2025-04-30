
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types/product';

export interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink: string;
  linkTo: string;
  titlePosition?: 'left' | 'right' | 'center';
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle, 
  products, 
  viewAllLink,
  linkTo,
  titlePosition = 'left' 
}) => {
  return (
    <div className="py-8">
      <div className={`flex items-center justify-between mb-6 ${titlePosition === 'center' ? 'flex-col text-center' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <Link to={viewAllLink} className="text-blue-600 hover:text-blue-800 flex items-center mt-2">
          View All <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
