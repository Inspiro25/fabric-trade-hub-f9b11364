
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/container';
import { PageHeading } from '@/components/ui/page-heading';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { getProductsByCategory } from '@/lib/products/filters';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/products/types';

const CategoryPage = () => {
  const { categoryId } = useParams<{categoryId: string}>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const { isDarkMode } = useTheme();
  const [totalProducts, setTotalProducts] = useState(0);
  
  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get products for this category
        const result = await getProductsByCategory(categoryId);
        
        if (result && Array.isArray(result)) {
          // Handle case where it returns just an array
          setProducts(result);
          setTotalProducts(result.length);
        } else if (result && 'products' in result && 'total' in result) {
          // Handle case where it returns { products, total }
          setProducts(result.products);
          setTotalProducts(result.total);
        } else {
          setProducts([]);
          setTotalProducts(0);
        }
        
        // Set category name from the first product or from the categoryId
        if (result && Array.isArray(result) && result.length > 0) {
          setCategoryName(result[0].category || categoryId);
        } else {
          setCategoryName(categoryId);
        }
      } catch (err) {
        console.error('Error loading category products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [categoryId]);
  
  // Format the category name for display
  const formattedCategoryName = categoryName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
  
  return (
    <>
      <Helmet>
        <title>{formattedCategoryName} | Kutuku</title>
        <meta name="description" content={`Browse our collection of ${formattedCategoryName.toLowerCase()} products`} />
      </Helmet>
      
      <div className={cn(
        "py-8 min-h-[80vh]",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      )}>
        <Container>
          <PageHeading 
            title={formattedCategoryName}
            subtitle={`${totalProducts} products available`}
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
              title="No products found"
              description="We couldn't find any products in this category"
              icon="search"
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </Container>
      </div>
    </>
  );
};

export default CategoryPage;
