
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SearchPageProduct } from '@/components/search/SearchProductCard';

export const useRecommendations = (userId: string | null) => {
  const [recommendations, setRecommendations] = useState<SearchPageProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      // If user is logged in, try to get personalized recommendations
      let recommendationsQuery = supabase.from('products').select('*');
      
      if (userId) {
        // First check if user has any search history or view history to base recommendations on
        const { data: searchHistory } = await supabase
          .from('search_history')
          .select('query')
          .eq('user_id', userId)
          .order('searched_at', { ascending: false })
          .limit(3);
          
        const { data: viewHistory } = await supabase
          .from('product_view_history')
          .select('product_id')
          .eq('user_id', userId)
          .order('last_viewed_at', { ascending: false })
          .limit(3);
        
        // If user has history, use it for recommendations
        if ((searchHistory && searchHistory.length > 0) || (viewHistory && viewHistory.length > 0)) {
          // If there's search history, try to match products to search terms
          if (searchHistory && searchHistory.length > 0) {
            const searchTerms = searchHistory.map(item => item.query);
            
            // Try to find products that match search terms
            for (const term of searchTerms) {
              recommendationsQuery = recommendationsQuery.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
            }
          }
          
          // If there's view history, get products in the same categories
          if (viewHistory && viewHistory.length > 0) {
            const productIds = viewHistory.map(item => item.product_id);
            
            // Get the categories of viewed products
            const { data: viewedProducts } = await supabase
              .from('products')
              .select('category_id')
              .in('id', productIds);
              
            if (viewedProducts && viewedProducts.length > 0) {
              const categories = viewedProducts.map(p => p.category_id).filter(Boolean);
              
              if (categories.length > 0) {
                recommendationsQuery = recommendationsQuery.in('category_id', categories);
              }
            }
          }
        } else {
          // No history, use trending products
          recommendationsQuery = recommendationsQuery.eq('is_trending', true);
        }
      } else {
        // No user, get trending products
        recommendationsQuery = recommendationsQuery.eq('is_trending', true);
      }
      
      // Limit and execute query
      const { data, error } = await recommendationsQuery
        .limit(8);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedRecommendations = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.price),
          sale_price: product.sale_price ? Number(product.sale_price) : null,
          images: product.images || ['/placeholder.svg'],
          category_id: product.category_id || '',
          shop_id: product.shop_id || '',
          is_new: product.is_new || false,
          is_trending: product.is_trending || false,
          colors: product.colors || [],
          sizes: product.sizes || [],
          rating: product.rating || 0,
          review_count: product.review_count || 0
        }));
        
        setRecommendations(formattedRecommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentlyViewed = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_view_history')
        .select('product_id, last_viewed_at')
        .eq('user_id', userId)
        .order('last_viewed_at', { ascending: false })
        .limit(4);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const productIds = data.map(item => item.product_id);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
          
        if (productsError) {
          throw productsError;
        }
        
        if (productsData && productsData.length > 0) {
          const formattedProducts = productsData.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: Number(product.price),
            sale_price: product.sale_price ? Number(product.sale_price) : null,
            images: product.images || ['/placeholder.svg'],
            category_id: product.category_id || '',
            shop_id: product.shop_id || '',
            is_new: product.is_new || false,
            is_trending: product.is_trending || false,
            colors: product.colors || [],
            sizes: product.sizes || [],
            rating: product.rating || 0,
            review_count: product.review_count || 0
          }));
          
          // Sort to match the order from view history
          const orderedProducts = productIds.map(id => 
            formattedProducts.find(product => product.id === id)
          ).filter(Boolean) as SearchPageProduct[];
          
          setRecentlyViewed(orderedProducts);
        }
      }
    } catch (error) {
      console.error('Error fetching recently viewed products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendations();
    if (userId) {
      fetchRecentlyViewed();
    }
  }, [userId]);

  return {
    recommendations,
    recentlyViewed,
    isLoading,
    fetchRecommendations,
    fetchRecentlyViewed
  };
};
