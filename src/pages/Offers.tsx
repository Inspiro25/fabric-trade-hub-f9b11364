import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Product } from '@/lib/products/types';
import { fetchProductsByIds } from '@/lib/products/base';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/useIsMobile';

const Offers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual logic to fetch product IDs for offers
        const offerProductIds = [
          'f4649a8a-2f90-4497-9a8a-8f1f7bca9e9a',
          '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          '6ec0bd77-1170-436e-9754-433d98196ca9',
          '49f68a8c-a5ea-4aa9-ad4c-ca1e5f3e9e9a',
          '8f5645ff-4966-4941-b94a-0a9f9e9e9e9e',
          '7a7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b7b'
        ];
        
        const fetchedProducts = await fetchProductsByIds(offerProductIds);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Offers | E-Commerce App</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Special Offers</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => {
              const animationDelay = `${index * 0.1}s`;
              return (
                <div key={product.id} style={{ animationDelay }} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Offers;
