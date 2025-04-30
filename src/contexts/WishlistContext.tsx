
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { ExtendedUser } from '@/types/auth';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category?: string;
  rating?: number;
  shopId?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isAdding: boolean | string;
  isRemoving: boolean | string;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState<boolean | string>(false);
  const [isRemoving, setIsRemoving] = useState<boolean | string>(false);
  const { currentUser } = useAuth();
  
  // Define isInWishlist before using it
  const isInWishlist = useCallback((itemId: string) => {
    return wishlist.some(item => item.id === itemId);
  }, [wishlist]);

  const fetchWishlist = useCallback(async () => {
    try {
      if (!currentUser) {
        setWishlist([]);
        setIsLoading(false);
        return;
      }

      const user = currentUser as ExtendedUser;
      setIsLoading(true);

      const { data, error } = await supabase
        .from('user_wishlists')
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            price,
            sale_price,
            images,
            category,
            rating
          )
        `)
        .eq('user_id', user.uid || user.id);

      if (error) throw error;

      const formattedWishlist: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.products?.id || item.product_id,
        name: item.products?.name || 'Product Name',
        price: item.products?.price || 0,
        salePrice: item.products?.sale_price,
        image: item.products?.images?.[0] || '',
        category: item.products?.category || '',
        rating: item.products?.rating || 0,
        shopId: item.products?.shop_id || ''
      }));

      setWishlist(formattedWishlist);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    try {
      if (!currentUser) {
        toast.error('Please login to add items to your wishlist');
        return;
      }

      const user = currentUser as ExtendedUser;
      setIsAdding(item.id);

      // Check if item already exists in wishlist
      if (isInWishlist(item.id)) {
        toast.info('Item already in wishlist');
        setIsAdding(false);
        return;
      }

      // Add to database
      const { error } = await supabase
        .from('user_wishlists')
        .insert({
          user_id: user.uid || user.id,
          product_id: item.id
        });

      if (error) throw error;

      // Update local state
      setWishlist(prev => [...prev, item]);
      toast.success('Added to wishlist');
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAdding(false);
    }
  }, [currentUser, isInWishlist]);

  const removeFromWishlist = useCallback(async (itemId: string) => {
    try {
      if (!currentUser) {
        toast.error('Please login to manage your wishlist');
        return;
      }

      const user = currentUser as ExtendedUser;
      setIsRemoving(itemId);

      // Remove from database
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', user.uid || user.id)
        .eq('product_id', itemId);

      if (error) throw error;

      // Update local state
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsRemoving(false);
    }
  }, [currentUser]);

  const clearWishlist = useCallback(async () => {
    try {
      if (!currentUser) {
        toast.error('Please login to manage your wishlist');
        return;
      }

      const user = currentUser as ExtendedUser;
      setIsLoading(true);

      // Clear from database
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', user.uid || user.id);

      if (error) throw error;

      // Update local state
      setWishlist([]);
      toast.success('Wishlist cleared');
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      toast.error('Failed to clear wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch wishlist when auth state changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isAdding,
        isRemoving,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
