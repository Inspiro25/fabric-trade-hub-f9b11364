
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/products/types';
import { useAuth } from './AuthContext';
import { 
  fetchUserWishlist, 
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  isInWishlist as checkIsInWishlist
} from '@/services/wishlistService';
import { toast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  isAddingToWishlist: string | null;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isLoading: false,
  isAddingToWishlist: null,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: async () => false,
  clearWishlist: () => {}
});

export const useWishlist = () => useContext(WishlistContext);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const { currentUser, isAuthenticated } = useAuth();

  const loadWishlist = async () => {
    if (!isAuthenticated || !currentUser?.id) return;

    setIsLoading(true);
    try {
      const items = await fetchUserWishlist(currentUser.id);
      setWishlist(items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, currentUser?.id]);

  const addToWishlist = async (product: Product) => {
    if (!isAuthenticated || !currentUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your wishlist",
        variant: "default"
      });
      return;
    }

    setIsAddingToWishlist(product.id);
    
    try {
      const success = await addToWishlistService(currentUser.id, product.id);
      if (success) {
        // Check if product is already in the wishlist
        const existingProduct = wishlist.find(item => item.id === product.id);
        if (!existingProduct) {
          setWishlist([...wishlist, product]);
        }
        
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated || !currentUser?.id) return;

    setIsAddingToWishlist(productId);
    
    try {
      const success = await removeFromWishlistService(currentUser.id, productId);
      if (success) {
        setWishlist(wishlist.filter(item => item.id !== productId));
        toast({
          title: "Removed from Wishlist",
          description: "Item has been removed from your wishlist",
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const isInWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !currentUser?.id) return false;
    
    try {
      return await checkIsInWishlist(currentUser.id, productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isLoading,
      isAddingToWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
