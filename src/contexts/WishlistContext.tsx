import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistContextType, Product } from '@/lib/products';
import { useAuth } from '@/contexts/AuthContext'; // Make sure this is imported
import { supabase } from '@/integrations/supabase/client';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth(); // Use the AuthContext to get the current user

  const addToWishlist = useCallback((product: Product | string) => {
    const productId = typeof product === 'string' ? product : product.id;
    if (!wishlist.includes(productId)) {
      setWishlist([...wishlist, productId]);
    }
  }, [wishlist]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(wishlist.filter(id => id !== productId));
  }, [wishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (currentUser) { // Replace references to standalone currentUser with context
          const { data, error } = await supabase
            .from('user_wishlists')
            .select('product_id')
            .eq('user_id', currentUser.id);

          if (error) {
            console.error('Error fetching wishlist:', error);
          } else {
            const productIds = data?.map(item => item.product_id) || [];
            setWishlist(productIds);
          }
        } else {
          // Handle the case where the user is not logged in (e.g., fetch from local storage)
          const storedWishlist = localStorage.getItem('wishlist');
          if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [currentUser]); // Make sure dependency array references the proper variable

  useEffect(() => {
    const saveWishlist = async () => {
      if (currentUser) {
        // Delete existing wishlist items for the user
        const { error: deleteError } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id);

        if (deleteError) {
          console.error('Error deleting existing wishlist items:', deleteError);
          return;
        }

        // Insert the updated wishlist items
        const wishlistItems = wishlist.map(productId => ({
          user_id: currentUser.id,
          product_id: productId,
        }));

        const { error: insertError } = await supabase
          .from('user_wishlists')
          .insert(wishlistItems);

        if (insertError) {
          console.error('Error saving wishlist:', insertError);
        }
      } else {
        // Save to local storage if user is not logged in
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    };

    saveWishlist();
  }, [wishlist, currentUser]);

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
