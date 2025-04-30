
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/products/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
  isAddingToWishlist: boolean | string;
  isRemovingFromWishlist: boolean | string;
  wishlist: string[]; // Add this property to match usage in components
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
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean | string>(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState<boolean | string>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Extract product IDs for simpler access
  const wishlist = useMemo(() => 
    wishlistItems.map(item => item.product.id), 
    [wishlistItems]
  );

  // Fetch wishlist items on mount or when user changes
  useEffect(() => {
    if (currentUser?.id) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch wishlist items from database
  const fetchWishlistItems = async () => {
    if (!currentUser?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_wishlists')
        .select(`
          id,
          created_at,
          product_id,
          products:product_id (*)
        `)
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      
      const items: WishlistItem[] = data.map(item => ({
        id: item.id,
        product: item.products as Product,
        addedAt: item.created_at
      }));
      
      setWishlistItems(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId);
  }, [wishlistItems]);

  // Add product to wishlist
  const addToWishlist = useCallback(async (product: Product): Promise<boolean> => {
    if (!currentUser) {
      navigate('/auth');
      return false;
    }
    
    if (isInWishlist(product.id)) {
      return true; // Already in wishlist
    }
    
    setIsAddingToWishlist(product.id);
    
    try {
      const { data, error } = await supabase
        .from('user_wishlists')
        .insert({
          user_id: currentUser.id,
          product_id: product.id
        })
        .select('id, created_at');
        
      if (error) throw error;
      
      const newItem: WishlistItem = {
        id: data[0].id,
        product,
        addedAt: data[0].created_at
      };
      
      setWishlistItems(prev => [...prev, newItem]);
      toast.success('Added to wishlist');
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return false;
    } finally {
      setIsAddingToWishlist(false);
    }
  }, [currentUser, isInWishlist, navigate]);

  // Remove product from wishlist
  const removeFromWishlist = useCallback(async (productId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }
    
    setIsRemovingFromWishlist(productId);
    
    try {
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);
        
      if (error) throw error;
      
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return false;
    } finally {
      setIsRemovingFromWishlist(false);
    }
  }, [currentUser]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async (): Promise<boolean> => {
    if (!currentUser || wishlistItems.length === 0) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', currentUser.id);
        
      if (error) throw error;
      
      setWishlistItems([]);
      toast.success('Wishlist cleared');
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
      return false;
    }
  }, [currentUser, wishlistItems]);

  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    isLoading,
    isAddingToWishlist,
    isRemovingFromWishlist,
    wishlist
  }), [
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    isLoading,
    isAddingToWishlist,
    isRemovingFromWishlist,
    wishlist
  ]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
