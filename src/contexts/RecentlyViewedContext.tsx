
import React, { createContext, useState, useContext, useEffect } from 'react';
import { SearchPageProduct } from '@/lib/types/search';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RecentlyViewedContextType {
  recentlyViewed: SearchPageProduct[];
  addToRecentlyViewed: (product: SearchPageProduct) => void;
  clearRecentlyViewed: () => void;
  isLoading: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
  isLoading: false,
});

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<SearchPageProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  // Load recently viewed products from local storage or database
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          // Load from database if user is logged in
          const { data, error } = await supabase
            .from('product_view_history')
            .select('product_id, last_viewed_at, view_count, products(*)')
            .eq('user_id', currentUser.id)
            .order('last_viewed_at', { ascending: false })
            .limit(10);
          
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            const formattedProducts = data.map(item => ({
              id: item.products.id,
              name: item.products.name,
              description: item.products.description || '',
              price: item.products.price,
              salePrice: item.products.sale_price,
              images: item.products.images || [],
              category: item.products.category_id,
              isNew: item.products.is_new,
              isTrending: item.products.is_trending,
              rating: item.products.rating || 0,
              reviewCount: item.products.review_count || 0,
              shop_id: item.products.shop_id,
            }));
            
            setRecentlyViewed(formattedProducts);
          }
        } else {
          // Load from local storage if user is not logged in
          const storedItems = localStorage.getItem('recentlyViewed');
          if (storedItems) {
            setRecentlyViewed(JSON.parse(storedItems));
          }
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, [currentUser]);

  // Save to storage when the list changes
  useEffect(() => {
    if (!currentUser && recentlyViewed.length > 0) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, currentUser]);

  const addToRecentlyViewed = async (product: SearchPageProduct) => {
    try {
      // Skip if already at the top of the list
      if (recentlyViewed.length > 0 && recentlyViewed[0].id === product.id) {
        return;
      }
      
      // Remove product if it's already in the list and add it to the beginning
      const updatedList = [
        product,
        ...recentlyViewed.filter(item => item.id !== product.id)
      ].slice(0, 10); // Keep only the 10 most recently viewed
      
      setRecentlyViewed(updatedList);
      
      // If user is logged in, save to database
      if (currentUser) {
        const { error } = await supabase.rpc('upsert_product_view', {
          p_user_id: currentUser.id,
          p_product_id: product.id
        });
        
        if (error) {
          console.error('Error updating view history:', error);
        }
      }
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const clearRecentlyViewed = async () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
    
    if (currentUser) {
      try {
        const { error } = await supabase
          .from('product_view_history')
          .delete()
          .eq('user_id', currentUser.id);
          
        if (error) {
          console.error('Error clearing view history:', error);
        }
      } catch (error) {
        console.error('Error clearing recently viewed products:', error);
      }
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
        isLoading
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};
