
import { useState, useEffect } from 'react';
import { Product } from '@/lib/products/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { mockProducts } from '@/lib/products';

export function useShopProducts(shopId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setIsLoading(false);
      return;
    }

    const fetchShopProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching products for shop:', shopId);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopId);
        
        if (error) {
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} products for shop ${shopId}`);
        
        if (data && data.length > 0) {
          // Map the data to match the Product type
          const formattedProducts = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            salePrice: item.sale_price,
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
            created_at: item.created_at,
            updated_at: item.created_at,
            shopId: item.shop_id,
            brand: '',
            shopName: '',
            categoryId: item.category_id || '',
          }));
          
          setProducts(formattedProducts);
        } else {
          // Use mock products if no products are found
          console.log('No products found for shop, using mock data');
          const mockShopProducts = mockProducts.map(p => ({...p, shopId: shopId})).slice(0, 5);
          setProducts(mockShopProducts);
        }
      } catch (err: any) {
        console.error('Error fetching shop products:', err);
        setError(err.message || 'Failed to load products');
        
        // Fallback to mock data in case of error
        const mockShopProducts = mockProducts.map(p => ({...p, shopId: shopId})).slice(0, 5);
        setProducts(mockShopProducts);
        
        toast({
          title: "Error loading shop products",
          description: "Using sample data instead",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopProducts();
  }, [shopId]);

  return { products, isLoading, error };
}
