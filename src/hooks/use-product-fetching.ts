
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, adaptProduct } from '@/lib/types/product';

export const useProductFetching = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw new Error(`Error fetching product: ${error.message}`);
      }

      if (!data) {
        throw new Error('Product not found');
      }

      // Use the adaptProduct function to standardize the product format
      setProduct(adaptProduct(data));
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const refreshProduct = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refreshProduct };
};

export default useProductFetching;
