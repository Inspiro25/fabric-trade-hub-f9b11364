
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import { PageHeading } from '@/components/ui/page-heading';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Product, adaptProduct } from '@/lib/products/types';
import { getNewArrivals } from '@/lib/products/filters';

const NewArrivalsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const newArrivals = await getNewArrivals();
        
        // Make sure to convert the products to the right format
        if (Array.isArray(newArrivals)) {
          const adaptedProducts = newArrivals.map(product => adaptProduct(product));
          setProducts(adaptedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error loading new arrivals:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>New Arrivals | Kutuku</title>
        <meta name="description" content="Discover the latest products on Kutuku" />
      </Helmet>
      
      <div className={cn(
        "py-8 min-h-[80vh]",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      )}>
        <Container>
          <PageHeading 
            title="New Arrivals" 
            subtitle="Discover our latest products"
          />
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className={cn(
              "p-4 mt-6 rounded-lg",
              isDarkMode ? "bg-red-900/30 text-red-300 border border-red-800" : "bg-red-50 text-red-600"
            )}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <EmptyState 
              title="No new arrivals"
              description="Check back soon for new products"
              icon="package"
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </Container>
      </div>
    </>
  );
};

export default NewArrivalsPage;
