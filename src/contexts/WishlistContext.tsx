import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types/product';
import { supabase } from '@/lib/supabase/client';

// Define the wishlist item type
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  product_id: string;
  shop_id?: string;
  user_id?: string;
}

// Define the context type
export interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  isAddingToWishlist?: boolean;
}

// Create the context
export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false
});

// Export the hook for using the context
export const useWishlist = () => useContext(WishlistContext);

// Create the provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean>(false);
  const { currentUser } = useAuth();

  // Function to check if an item is in the wishlist
  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId || item.id === productId);
  };

  // Load wishlist from local storage or database
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        // If user is authenticated, load from database
        if (currentUser?.id) {
          const { data, error } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', currentUser.id);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setWishlist(data.map(item => ({
              id: item.id,
              product_id: item.product_id,
              name: item.name,
              price: item.price || 0,
              image: item.image || '',
              shop_id: item.shop_id
            })));
          }
        } else {
          // Otherwise, load from local storage
          const storedWishlist = localStorage.getItem('wishlist');
          if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };

    loadWishlist();
  }, [currentUser?.id]);

  // Save wishlist to local storage or database
  useEffect(() => {
    // Only save if wishlist changes
    if (wishlist.length > 0) {
      if (currentUser?.id) {
        // Don't need to save here, we save individually when adding/removing
      } else {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    }
  }, [wishlist, currentUser?.id]);

  // Add to wishlist
  const addToWishlist = async (product: Product) => {
    try {
      setIsAddingToWishlist(true);
      
      // Check if the product is already in the wishlist
      if (isInWishlist(product.id)) {
        toast.info('Product is already in your wishlist');
        return;
      }

      const newItem: WishlistItem = {
        id: product.id,
        product_id: product.id,
        name: product.name,
        price: product.price || 0,
        image: product.images?.[0] || '',
        shop_id: product.shop_id
      };

      // If user is authenticated, save to database
      if (currentUser?.id) {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: currentUser.id,
            product_id: product.id,
            name: product.name,
            price: product.price || 0,
            image: product.images?.[0] || '',
            shop_id: product.shop_id
          });
        
        if (error) throw error;
      }

      // Update local state
      setWishlist(prev => [...prev, newItem]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    try {
      // If user is authenticated, remove from database
      if (currentUser?.id) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .match({ 
            user_id: currentUser.id,
            product_id: productId 
          });
        
        if (error) throw error;
      }

      // Update local state
      setWishlist(prev => prev.filter(item => item.product_id !== productId && item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      // If user is authenticated, clear from database
      if (currentUser?.id) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
      }

      // Update local state
      setWishlist([]);
      localStorage.removeItem('wishlist');
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      clearWishlist, 
      isInWishlist,
      isAddingToWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
