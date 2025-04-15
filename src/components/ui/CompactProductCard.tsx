
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products/types';
import { cn } from '@/lib/utils';

interface CompactProductCardProps {
  product: Product;
  isDarkMode?: boolean;
}

const CompactProductCard: React.FC<CompactProductCardProps> = ({ product, isDarkMode }) => {
  return (
    <Link 
      to={`/products/${product.id}`}
      className={cn(
        "block rounded-lg overflow-hidden border",
        isDarkMode 
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
          : "bg-white border-gray-200 hover:shadow-md"
      )}
    >
      <div className="relative aspect-square">
        {product.images && product.images[0] && (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        
        {product.isNew && (
          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
            New
          </div>
        )}
      </div>
      
      <div className="p-2">
        <h3 className={cn(
          "text-xs font-medium line-clamp-1",
          isDarkMode ? "text-gray-200" : "text-gray-800"
        )}>
          {product.name}
        </h3>
        
        <div className="flex items-baseline mt-1 gap-1">
          <span className={cn(
            "text-sm font-bold",
            isDarkMode ? "text-orange-400" : "text-orange-600"
          )}>
            ${product.salePrice || product.price}
          </span>
          
          {product.salePrice && (
            <span className="text-xs line-through text-gray-500">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CompactProductCard;
