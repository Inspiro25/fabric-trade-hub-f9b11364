
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, WishlistContextType } from '@/types/product';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  isLoading: false,
});

export const useWishlist = () => useContext(WishlistContext);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();

  // Load wishlist from database or local storage
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (currentUser?.id) {
          // Fetch wishlist from database if user is authenticated
          const { data, error } = await supabase
            .from('user_wishlists')
            .select('product_id')
            .eq('user_id', currentUser.id);

          if (error) throw error;

          const productIds = data.map(item => item.product_id);
          setWishlist(productIds);
        } else {
          // Load from local storage if not authenticated
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast({
          title: 'Error',
          description: 'Failed to load wishlist items',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [currentUser]);

  // Save wishlist to local storage whenever it changes
  useEffect(() => {
    if (!isLoading && !currentUser) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading, currentUser]);

  const addToWishlist = async (product: Product | string) => {
    const productId = typeof product === 'string' ? product : product.id;

    // Don't add if already in wishlist
    if (wishlist.includes(productId)) {
      return;
    }

    try {
      if (currentUser?.id) {
        // Add to database if user is authenticated
        const { error } = await supabase.from('user_wishlists').insert({
          user_id: currentUser.id,
          product_id: productId,
        });

        if (error) throw error;
      }

      // Update local state
      setWishlist(prev => [...prev, productId]);
      
      toast({
        title: 'Added to Wishlist',
        description: 'Product added to your wishlist',
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist',
        variant: 'destructive',
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (currentUser?.id) {
        // Remove from database if user is authenticated
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);

        if (error) throw error;
      }

      // Update local state
      setWishlist(prev => prev.filter(id => id !== productId));
      
      toast({
        title: 'Removed from Wishlist',
        description: 'Product removed from your wishlist',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist',
        variant: 'destructive',
      });
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
