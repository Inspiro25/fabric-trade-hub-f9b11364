
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/products/types';
import { adaptProduct } from '@/lib/products/types';

export interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isLoading: false,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  toggleWishlist: () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          // Convert the saved products to the proper format
          const parsedWishlist = JSON.parse(savedWishlist);
          const adaptedWishlist = parsedWishlist.map((product: any) => adaptProduct(product));
          setWishlist(adaptedWishlist);
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist(prevWishlist => [...prevWishlist, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
