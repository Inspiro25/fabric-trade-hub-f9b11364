
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types/product';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  isLoading: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load recently viewed products from storage
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          // If user is logged in, fetch from Supabase
          const { data, error } = await supabase
            .from('product_view_history')
            .select('product_id, last_viewed_at, view_count')
            .eq('user_id', currentUser.uid)
            .order('last_viewed_at', { ascending: false })
            .limit(10);
            
          if (error) {
            console.error('Error fetching recently viewed products:', error);
            // Fall back to local storage
            const localData = localStorage.getItem('recently_viewed');
            if (localData) {
              setRecentlyViewed(JSON.parse(localData));
            }
          } else if (data && data.length > 0) {
            // Fetch full product details for each product ID
            const productIds = data.map(item => item.product_id);
            const { data: products, error: productsError } = await supabase
              .from('products')
              .select('*')
              .in('id', productIds);
              
            if (productsError) {
              console.error('Error fetching products details:', productsError);
            } else {
              // Sort products based on the order from view history
              const sortedProducts = productIds.map(id => 
                products?.find(product => product.id === id)
              ).filter(Boolean) as Product[];
              
              setRecentlyViewed(sortedProducts);
            }
          }
        } else {
          // If no user is logged in, use localStorage
          const localData = localStorage.getItem('recently_viewed');
          if (localData) {
            setRecentlyViewed(JSON.parse(localData));
          }
        }
      } catch (error) {
        console.error('Failed to load recently viewed products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, [currentUser]);
  
  // Save recently viewed to storage when it changes
  useEffect(() => {
    if (!isLoading && recentlyViewed.length > 0) {
      localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoading]);
  
  const addToRecentlyViewed = useCallback(async (product: Product) => {
    // Skip if already at the top of recently viewed
    if (recentlyViewed.length > 0 && recentlyViewed[0].id === product.id) {
      return;
    }
    
    // Remove product if it exists in the list (to avoid duplicates)
    const filteredList = recentlyViewed.filter(p => p.id !== product.id);
    
    // Add product to the beginning of the list
    const newList = [product, ...filteredList].slice(0, 10);
    setRecentlyViewed(newList);
    
    // If user is logged in, update in Supabase
    if (currentUser) {
      try {
        const { data, error } = await supabase
          .from('product_view_history')
          .select('*')
          .eq('user_id', currentUser.uid)
          .eq('product_id', product.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking product view history:', error);
          return;
        }
        
        if (data) {
          // Update existing record
          await supabase
            .from('product_view_history')
            .update({
              last_viewed_at: new Date().toISOString(),
              view_count: data.view_count + 1
            })
            .eq('id', data.id);
        } else {
          // Insert new record
          await supabase
            .from('product_view_history')
            .insert({
              user_id: currentUser.uid,
              product_id: product.id,
              last_viewed_at: new Date().toISOString(),
              view_count: 1
            });
        }
      } catch (error) {
        console.error('Error updating product view history:', error);
      }
    }
  }, [recentlyViewed, currentUser]);
  
  const clearRecentlyViewed = useCallback(async () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recently_viewed');
    
    // If user is logged in, clear from Supabase
    if (currentUser) {
      try {
        await supabase
          .from('product_view_history')
          .delete()
          .eq('user_id', currentUser.uid);
      } catch (error) {
        console.error('Error clearing product view history:', error);
      }
    }
  }, [currentUser]);
  
  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
      isLoading
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};
