
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    images?: string[];
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn(
      "group rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-all",
      "border border-gray-200 dark:border-gray-700",
      className
    )}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-700">
          <img
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-1 text-gray-800 dark:text-gray-200">
            {product.name}
          </h3>
          <div className="space-y-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ₹{product.price}
            </span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                product.stock > 0 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              )}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
