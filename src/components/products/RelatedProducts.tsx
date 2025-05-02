
import React from 'react';
import { Product } from '@/lib/products/types';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId,
  categoryId,
  limit = 4
}) => {
  // This would typically fetch products based on the categoryId
  // For now we'll just return a placeholder
  const relatedProducts: Product[] = [];
  
  if (relatedProducts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No related products found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
