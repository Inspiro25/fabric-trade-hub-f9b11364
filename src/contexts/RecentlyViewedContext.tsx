
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

interface RecentlyViewedContextProps {
  recentlyViewed: RecentlyViewedProduct[];
  addToRecentlyViewed: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
  clearRecentlyViewed: () => void;
  isLoading: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextProps>({
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
  isLoading: false,
});

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

const MAX_RECENTLY_VIEWED = 20;
const STORAGE_KEY = 'recentlyViewed';

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load recently viewed items from localStorage or database
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          // Load from database for logged in users
          const { data, error } = await supabase
            .from('recently_viewed')
            .select('product_id, product_name, product_price, product_image, viewed_at')
            .eq('user_id', currentUser.uid || '')
            .order('viewed_at', { ascending: false })
            .limit(MAX_RECENTLY_VIEWED);

          if (error) {
            throw error;
          }

          if (data) {
            const formattedData = data.map(item => ({
              id: item.product_id,
              name: item.product_name,
              price: item.product_price,
              image: item.product_image,
              viewedAt: new Date(item.viewed_at).getTime(),
            }));
            setRecentlyViewed(formattedData);
          }
        } else {
          // Load from localStorage for guest users
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setRecentlyViewed(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error('Error loading recently viewed products:', err);
        toast.error('Failed to load recently viewed products');
        
        // Fallback to localStorage if database fails
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecentlyViewed(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentlyViewed();
  }, [currentUser]);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && !currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, isLoading, currentUser]);

  const addToRecentlyViewed = async (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    try {
      const viewedAt = Date.now();
      const newProduct = { ...product, viewedAt };
      
      // Remove duplicate if exists and add to beginning
      const filtered = recentlyViewed.filter(item => item.id !== product.id);
      const updated = [newProduct, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      
      setRecentlyViewed(updated);
      
      // Save to database if user is logged in
      if (currentUser && currentUser.uid) {
        await supabase.from('recently_viewed').upsert({
          user_id: currentUser.uid,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          viewed_at: new Date(viewedAt).toISOString(),
        });
      }
    } catch (err) {
      console.error('Error adding to recently viewed:', err);
      toast.error('Failed to update recently viewed products');
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      setRecentlyViewed([]);
      
      // Clear from database if user is logged in
      if (currentUser && currentUser.uid) {
        await supabase
          .from('recently_viewed')
          .delete()
          .eq('user_id', currentUser.uid);
      }
      
      // Also clear from localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      toast.success('Recently viewed products cleared');
    } catch (err) {
      console.error('Error clearing recently viewed products:', err);
      toast.error('Failed to clear recently viewed products');
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
      isLoading,
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
