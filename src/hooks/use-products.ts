
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products/types';
import { supabase } from '@/lib/supabase';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(12);
        
        if (error) throw error;
        
        // Transform DB data to match Product type
        const transformedProducts: Product[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          salePrice: item.sale_price || null,
          images: item.images || [],
          category: item.category_id || '',
          colors: item.colors || [],
          sizes: item.sizes || [],
          isNew: item.is_new || false,
          isTrending: item.is_trending || false,
          rating: item.rating || 0,
          reviewCount: item.review_count || 0,
          stock: item.stock || 0,
          tags: item.tags || [],
          shopId: item.shop_id || '',
          brand: '',
          categoryId: item.category_id || '',
          shopName: '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || ''
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  return { products, isLoading, error };
};
