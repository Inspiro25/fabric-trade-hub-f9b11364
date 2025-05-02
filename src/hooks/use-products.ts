
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products/types';
import { mockProducts } from '@/lib/types/product';

interface UseProductsProps {
  id?: string;
  categoryId?: string;
  limit?: number;
}

export const useProducts = ({ id, categoryId, limit }: UseProductsProps = {}) => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // For now, simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (id) {
          // Find the product by ID from mockProducts
          const product = mockProducts.find(p => p.id === id);
          
          if (product) {
            setData(product);
          } else {
            setError('Product not found');
          }
        } else if (categoryId) {
          // Here we could filter products by category if needed
          // For now, just return null
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, categoryId]);

  return { data, isLoading, error };
};

export default useProducts;
