
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SearchPageProduct } from '@/components/search/SearchProductCard';
import { toast } from '@/hooks/use-toast';

export const useSearchRecommendations = () => {
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Query for trending products to use as recommendations
      const { data: trendingProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_trending', true)
        .limit(8);
      
      if (error) {
        console.error('Error fetching trending products:', error);
        throw error;
      }
      
      if (trendingProducts) {
        const formattedProducts: SearchPageProduct[] = trendingProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          sale_price: product.sale_price ? Number(product.sale_price) : null,
          salePrice: product.sale_price ? Number(product.sale_price) : null,
          images: product.images || ['/placeholder.svg'],
          category: product.category_id || '',
          category_id: product.category_id || '',
          shop_id: product.shop_id || '',
          shopId: product.shop_id || '',
          is_new: product.is_new || false,
          isNew: product.is_new || false,
          is_trending: product.is_trending || false,
          isTrending: product.is_trending || false,
          colors: product.colors || [],
          sizes: product.sizes || [],
          rating: product.rating || 0,
          review_count: product.review_count || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0
        }));
        
        setRecommendations(formattedProducts);
      }
      
      // Fetch recently viewed products if user is logged in
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: viewHistory, error: viewError } = await supabase
          .from('product_view_history')
          .select('product_id')
          .eq('user_id', session.session.user.id)
          .order('last_viewed_at', { ascending: false })
          .limit(4);
        
        if (viewError) {
          console.error('Error fetching view history:', viewError);
        } else if (viewHistory && viewHistory.length > 0) {
          const productIds = viewHistory.map(item => item.product_id);
          
          const { data: viewedProducts, error: viewedError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);
            
          if (viewedError) {
            console.error('Error fetching viewed products:', viewedError);
          } else if (viewedProducts) {
            const formattedViewed: SearchPageProduct[] = viewedProducts.map(product => ({
              id: product.id,
              name: product.name,
              description: product.description || '',
              price: Number(product.price),
              sale_price: product.sale_price ? Number(product.sale_price) : null,
              salePrice: product.sale_price ? Number(product.sale_price) : null,
              images: product.images || ['/placeholder.svg'],
              category: product.category_id || '',
              category_id: product.category_id || '',
              shop_id: product.shop_id || '',
              shopId: product.shop_id || '',
              is_new: product.is_new || false,
              isNew: product.is_new || false,
              is_trending: product.is_trending || false,
              isTrending: product.is_trending || false,
              colors: product.colors || [],
              sizes: product.sizes || [],
              rating: product.rating || 0,
              review_count: product.review_count || 0,
              reviewCount: product.review_count || 0,
              stock: product.stock || 0
            }));
            
            // Sort products according to the view history order
            const sortedProducts = productIds
              .map(id => formattedViewed.find(p => p.id === id))
              .filter(Boolean) as SearchPageProduct[];
            
            setRecentlyViewed(sortedProducts);
          }
        }
      }
    } catch (error: any) {
      console.error('Error in fetchRecommendations:', error);
      toast({
        title: "Failed to load recommendations",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendations();
  }, []);
  
  return {
    recommendations,
    recentlyViewed,
    isLoading,
    refetch: fetchRecommendations
  };
};
