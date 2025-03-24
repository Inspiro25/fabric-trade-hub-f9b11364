
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types/product';
import { toast } from '@/hooks/use-toast';
import { adaptProduct } from '@/lib/products/types';

export interface WishlistContextType {
  wishlistItems: Product[];
  isWishlistLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  isAddingToWishlist: string | null;
  // Adding properties needed by other components
  wishlist: string[];
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  isWishlistLoading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  clearWishlist: async () => {},
  wishlistCount: 0,
  isInWishlist: () => false,
  isAddingToWishlist: null,
  // Adding default values for new properties
  wishlist: [],
  isLoading: false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { currentUser, isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) {
      // If not authenticated, try to get wishlist from local storage
      try {
        const storedWishlist = localStorage.getItem('guest_wishlist');
        if (storedWishlist) {
          const parsedWishlist = JSON.parse(storedWishlist);
          setWishlistItems(parsedWishlist.map((item: any) => adaptProduct(item)));
          setWishlist(parsedWishlist.map((item: any) => item.id));
        }
      } catch (error) {
        console.error('Error fetching guest wishlist:', error);
      }
      setIsWishlistLoading(false);
      return;
    }

    try {
      setIsWishlistLoading(true);
      const { data, error } = await supabase
        .from('user_wishlists')
        .select('product_id, products(*)')
        .eq('user_id', currentUser.id);

      if (error) {
        throw error;
      }

      if (data) {
        const products = data.map((item) => adaptProduct(item.products));
        const productIds = data.map((item) => item.product_id);
        setWishlistItems(products);
        setWishlist(productIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Failed to load wishlist",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  }, [isAuthenticated, currentUser?.id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product: Product) => {
    try {
      setIsAddingToWishlist(product.id);
      
      if (!isAuthenticated || !currentUser?.id) {
        // If not authenticated, store in local storage
        const storedWishlist = localStorage.getItem('guest_wishlist');
        let wishlistData = storedWishlist ? JSON.parse(storedWishlist) : [];
        
        if (!wishlistData.some((item: Product) => item.id === product.id)) {
          wishlistData.push(product);
          localStorage.setItem('guest_wishlist', JSON.stringify(wishlistData));
          setWishlistItems(wishlistData);
          setWishlist(wishlistData.map((item: Product) => item.id));
        }
        
        setIsAddingToWishlist(null);
        return;
      }

      const { error } = await supabase
        .from('user_wishlists')
        .insert({
          user_id: currentUser.id,
          product_id: product.id,
        });

      if (error) {
        if (error.code === '23505') { // Duplicate key error
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist.",
          });
        } else {
          throw error;
        }
      } else {
        setWishlistItems((prev) => [...prev, product]);
        setWishlist((prev) => [...prev, product.id]);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist.",
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Failed to add to wishlist",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (!isAuthenticated || !currentUser?.id) {
        // If not authenticated, remove from local storage
        const storedWishlist = localStorage.getItem('guest_wishlist');
        if (storedWishlist) {
          const wishlistData = JSON.parse(storedWishlist).filter(
            (item: Product) => item.id !== productId
          );
          localStorage.setItem('guest_wishlist', JSON.stringify(wishlistData));
          setWishlistItems(wishlistData);
          setWishlist(wishlistData.map((item: Product) => item.id));
        }
        return;
      }

      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);

      if (error) {
        throw error;
      }

      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Failed to remove from wishlist",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const clearWishlist = async () => {
    try {
      if (!isAuthenticated || !currentUser?.id) {
        // If not authenticated, clear local storage
        localStorage.removeItem('guest_wishlist');
        setWishlistItems([]);
        setWishlist([]);
        return;
      }

      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) {
        throw error;
      }

      setWishlistItems([]);
      setWishlist([]);
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Failed to clear wishlist",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const contextValue: WishlistContextType = {
    wishlistItems,
    isWishlistLoading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    isInWishlist,
    isAddingToWishlist,
    // Add the new properties
    wishlist,
    isLoading: isWishlistLoading,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
