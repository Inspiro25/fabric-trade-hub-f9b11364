
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/lib/products';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const ProductGrid = ({
  products,
  title,
  subtitle,
  columns = 4,
  className = '',
}: ProductGridProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <div className={`container mx-auto px-4 md:px-6 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && <h2 className="heading-lg mb-3">{title}</h2>}
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className={`grid ${getGridCols()} gap-6 md:gap-8`}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`transition-all duration-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.images[0]}
              category={product.category}
              isNew={product.isNew}
              isTrending={product.isTrending}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
