
import React from 'react';
import { ProductCardBaseProps } from './types';

export const CompactProductCard: React.FC<ProductCardBaseProps> = ({ product, onClick }) => {
  return (
    <div 
      className="p-2 border rounded cursor-pointer hover:bg-gray-50"
      onClick={() => onClick?.(product)}
    >
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
          {product.images?.[0] && (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
          <p className="text-xs text-gray-500">
            ₹{product.price.toFixed(2)}
            {product.salePrice && (
              <span className="ml-2 line-through text-gray-400">
                ₹{product.salePrice.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
