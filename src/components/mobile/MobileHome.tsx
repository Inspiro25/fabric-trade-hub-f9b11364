
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/lib/products';

// Minimal version of MobileHome to prevent errors
const MobileHome = () => {
  const { products, isLoading } = useProducts();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    // Set dataLoaded to true after a short delay to simulate data loading
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !dataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mobile Home</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Featured Products</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="border p-2 rounded">
              <div className="aspect-square overflow-hidden bg-gray-100 mb-2">
                {product.images && product.images[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
