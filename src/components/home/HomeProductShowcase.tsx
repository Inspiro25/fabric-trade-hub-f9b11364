
import React from 'react';
import { Product } from '@/lib/products/types';

export interface ProductShowcaseProps {
  title: string;
  products: Product[];
  isLoaded: boolean;
}

const HomeProductShowcase: React.FC<ProductShowcaseProps> = ({ 
  title = "Featured Products", 
  products = [], 
  isLoaded = true
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            <div className="mb-2 h-40 bg-gray-100 rounded flex items-center justify-center">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-cover"
                />
              ) : (
                <div>No Image</div>
              )}
            </div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeProductShowcase;
