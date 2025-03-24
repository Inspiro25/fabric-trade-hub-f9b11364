
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Product type for the recently viewed context
export interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  viewedAt: Date;
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedProduct[];
  addToRecentlyViewed: (product: RecentlyViewedProduct) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed: [],
  addToRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
});

export const useRecentlyViewed = () => useContext(RecentlyViewedContext);

const LOCAL_STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 10;

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const { user } = useAuth();

  // Load recent views on mount (from local storage or database)
  useEffect(() => {
    const loadRecentViews = async () => {
      if (user && user.id) {
        try {
          // Load from database if user is authenticated
          const { data, error } = await supabase
            .from('product_view_history')
            .select('product_id, last_viewed_at, view_count')
            .eq('user_id', user.id)
            .order('last_viewed_at', { ascending: false })
            .limit(MAX_ITEMS);

          if (error) {
            console.error('Error fetching recent views:', error);
            loadFromLocalStorage();
            return;
          }

          if (data && data.length > 0) {
            // Fetch product details for each recent view
            const productIds = data.map(item => item.product_id);
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('id, name, price, images, category_id')
              .in('id', productIds);

            if (productsError) {
              console.error('Error fetching products:', productsError);
              loadFromLocalStorage();
              return;
            }

            // Map products with view dates
            const recentProducts: RecentlyViewedProduct[] = productsData.map(product => {
              const viewItem = data.find(item => item.product_id === product.id);
              return {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                category: product.category_id,
                viewedAt: viewItem ? new Date(viewItem.last_viewed_at) : new Date(),
              };
            });

            setRecentlyViewed(recentProducts);
          } else {
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error('Error in loadRecentViews:', error);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          // Convert string dates back to Date objects
          const itemsWithDates = parsedItems.map((item: any) => ({
            ...item,
            viewedAt: new Date(item.viewedAt),
          }));
          setRecentlyViewed(itemsWithDates);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    };

    loadRecentViews();
  }, [user]);

  // Save to local storage whenever recentlyViewed changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = async (product: RecentlyViewedProduct) => {
    // Check if product is already in the list
    const existingIndex = recentlyViewed.findIndex(item => item.id === product.id);
    let newList: RecentlyViewedProduct[] = [];

    if (existingIndex >= 0) {
      // Update existing product's viewedAt date
      newList = [...recentlyViewed];
      newList[existingIndex] = {
        ...newList[existingIndex],
        viewedAt: new Date(),
      };
    } else {
      // Add new product to the beginning of the list
      newList = [
        { ...product, viewedAt: new Date() },
        ...recentlyViewed,
      ].slice(0, MAX_ITEMS); // Keep only MAX_ITEMS
    }

    setRecentlyViewed(newList);

    // If user is logged in, update the database
    if (user && user.id) {
      try {
        const { error } = await supabase
          .from('product_view_history')
          .upsert({
            user_id: user.id,
            product_id: product.id,
            last_viewed_at: new Date().toISOString(),
            view_count: 1, // This will be incremented by the database trigger
          }, {
            onConflict: 'user_id,product_id',
          });

        if (error) {
          console.error('Error updating view history:', error);
        }
      } catch (error) {
        console.error('Error in addToRecentlyViewed:', error);
      }
    }
  };

  const clearRecentlyViewed = async () => {
    setRecentlyViewed([]);
    
    // Clear from local storage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    // If user is logged in, clear from database
    if (user && user.id) {
      try {
        const { error } = await supabase
          .from('product_view_history')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error clearing view history:', error);
        }
      } catch (error) {
        console.error('Error in clearRecentlyViewed:', error);
      }
    }
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
