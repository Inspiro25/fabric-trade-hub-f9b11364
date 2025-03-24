
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProductById } from '@/lib/products';

interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedProduct[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
});

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

const LOCAL_STORAGE_KEY = 'recentlyViewedProducts';
const MAX_PRODUCTS = 10;

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load recently viewed products from local storage
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          setRecentlyViewed(parsedItems);
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, []);
  
  // Save to local storage whenever the list changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoading]);
  
  const addToRecentlyViewed = async (productId: string) => {
    try {
      // Fetch product details
      const product = await getProductById(productId);
      
      if (!product) return;
      
      // Create new entry
      const newItem: RecentlyViewedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        viewedAt: new Date().toISOString(),
      };
      
      setRecentlyViewed(prev => {
        // Remove if already exists
        const filtered = prev.filter(item => item.id !== productId);
        
        // Add at the beginning and limit to MAX_PRODUCTS
        return [newItem, ...filtered].slice(0, MAX_PRODUCTS);
      });
      
      // Also record in Supabase if user is logged in
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const userId = session.session.user.id;
          
          // Check if this product is already viewed by this user
          const { data } = await supabase
            .from('product_view_history')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();
            
          if (data) {
            // Update existing record
            await supabase
              .from('product_view_history')
              .update({
                view_count: data.view_count + 1,
                last_viewed_at: new Date().toISOString()
              })
              .eq('id', data.id);
          } else {
            // Create new record
            await supabase
              .from('product_view_history')
              .insert({
                user_id: userId,
                product_id: productId,
                view_count: 1
              });
          }
        }
      } catch (err) {
        console.error('Error recording product view in database:', err);
        // Continue execution, this is just for analytics
      }
      
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };
  
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  
  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};
