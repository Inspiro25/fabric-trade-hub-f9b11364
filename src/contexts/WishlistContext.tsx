
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Product, adaptProduct } from '@/lib/products/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlistItems: Product[];
  isLoading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isWishlistItem: (productId: string) => boolean;
  totalWishlistItems: number;
  isAddingToWishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          // Fetch wishlist from database for logged-in users
          const { data, error } = await supabase
            .from('user_wishlists')
            .select('product_id, products(*)')
            .eq('user_id', currentUser.id);
          
          if (error) throw error;
          
          // Map the joined data to products
          const wishlistProducts = data
            .filter(item => item.products)
            .map(item => adaptProduct(item.products));
          
          setWishlistItems(wishlistProducts);
        } else {
          // Use local storage for guest users
          const storedWishlist = localStorage.getItem('guest_wishlist');
          if (storedWishlist) {
            try {
              const parsedWishlist = JSON.parse(storedWishlist);
              // Ensure each item is properly adapted to the Product type
              setWishlistItems(parsedWishlist.map((item: any) => adaptProduct(item)));
            } catch (e) {
              console.error('Error parsing wishlist from localStorage:', e);
              setWishlistItems([]);
              localStorage.removeItem('guest_wishlist');
            }
          } else {
            setWishlistItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  const addToWishlist = useCallback(async (product: Product) => {
    setIsAddingToWishlist(true);
    try {
      // Validate and adapt the product
      const adaptedProduct = adaptProduct(product);
      
      // Check if item is already in the wishlist
      if (wishlistItems.some(item => item.id === adaptedProduct.id)) {
        toast.info('Item is already in your wishlist');
        return;
      }

      if (currentUser) {
        // Save to database for logged-in users
        const { error } = await supabase
          .from('user_wishlists')
          .insert({
            user_id: currentUser.id,
            product_id: adaptedProduct.id
          });
        
        if (error) throw error;
      } else {
        // Save to local storage for guest users
        const updatedWishlist = [...wishlistItems, adaptedProduct];
        localStorage.setItem('guest_wishlist', JSON.stringify(updatedWishlist));
      }
      
      // Update state
      setWishlistItems(prev => [...prev, adaptedProduct]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  }, [currentUser, wishlistItems]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      if (currentUser) {
        // Remove from database for logged-in users
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);
        
        if (error) throw error;
      } else {
        // Remove from local storage for guest users
        const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
        localStorage.setItem('guest_wishlist', JSON.stringify(updatedWishlist));
      }
      
      // Update state
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  }, [currentUser, wishlistItems]);

  const clearWishlist = useCallback(async () => {
    try {
      if (currentUser) {
        // Clear all items for the user in the database
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
      } else {
        // Clear local storage for guest users
        localStorage.removeItem('guest_wishlist');
      }
      
      // Clear state
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  }, [currentUser]);

  const isWishlistItem = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistItem,
        totalWishlistItems: wishlistItems.length,
        isAddingToWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
