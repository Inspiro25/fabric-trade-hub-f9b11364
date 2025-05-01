
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images?: string[];
  };
  className?: string;
  id?: string;
  name?: string;
  price?: number;
  salePrice?: number;
  image?: string;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  layout?: string;
  rating?: number;
  reviewCount?: number;
  variant?: string;
}

export function ProductCard({ product, className, id, name, price, salePrice, image, category, isNew, isTrending, layout, rating, reviewCount, variant }: ProductCardProps) {
  // If direct properties are provided, use those instead of product object
  const productId = id || product?.id;
  const productName = name || product?.name;
  const productPrice = price || product?.price;
  const productImage = image || product?.images?.[0] || '/placeholder.png';
  const productStock = product?.stock || 0;

  return (
    <div className={cn(
      "group rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-all",
      "border border-gray-200 dark:border-gray-700",
      className
    )}>
      <Link to={`/product/${productId}`} className="block">
        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700">
          <img
            src={productImage}
            alt={productName}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-800 dark:text-gray-200">
            {productName}
          </h3>
          <div className="space-y-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ₹{salePrice || productPrice}
            </span>
            <div className="flex items-center gap-2">
              {product && (
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  productStock > 0 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}>
                  {productStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
