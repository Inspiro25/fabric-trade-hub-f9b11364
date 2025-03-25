
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/lib/products/types';
import { toast } from 'sonner';
import { getWishlistItems, addWishlistItem, removeWishlistItem } from '@/services/wishlistService';

export interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  isAddingToWishlist: string | boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isLoading: false,
  isAddingToWishlist: false,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | boolean>(false);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        const items = await getWishlistItems();
        setWishlist(items);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const addToWishlist = async (product: Product) => {
    try {
      setIsAddingToWishlist(product.id);
      
      // Check if product is already in wishlist
      if (isInWishlist(product.id)) {
        toast.info('Product is already in your wishlist');
        setIsAddingToWishlist(false);
        return;
      }
      
      // Add to wishlist
      await addWishlistItem(product);
      
      // Update local state
      setWishlist(prev => [...prev, product]);
      
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      // Remove from wishlist
      await removeWishlistItem(productId);
      
      // Update local state
      setWishlist(prev => prev.filter(item => item.id !== productId));
      
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    // In a real app, you would also clear the wishlist in the database
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isAddingToWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
