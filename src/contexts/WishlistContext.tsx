
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { 
  fetchUserWishlist, 
  addToWishlist as addToWishlistService, 
  removeFromWishlist as removeFromWishlistService,
  isInWishlist as checkIsInWishlist
} from '@/services/wishlistService';
import { Product } from '@/lib/types/product';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (product: Product | any) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          try {
            const { data, error } = await supabase
              .from('user_wishlists')
              .select('product_id')
              .eq('user_id', currentUser.uid);
            
            if (error) {
              console.error('Error fetching wishlist from Supabase:', error);
              const savedWishlist = localStorage.getItem('wishlist');
              setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
            } else {
              const productIds = data.map(item => item.product_id);
              setWishlist(productIds);
              localStorage.setItem('wishlist', JSON.stringify(productIds));
            }
          } catch (supabaseError) {
            console.error('Exception in Supabase wishlist fetch:', supabaseError);
            const savedWishlist = localStorage.getItem('wishlist');
            setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
          }
        } else {
          const savedWishlist = localStorage.getItem('wishlist');
          setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        const savedWishlist = localStorage.getItem('wishlist');
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlist();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = async (product: Product | any) => {
    try {
      if (wishlist.includes(product.id)) return;
      
      if (currentUser) {
        try {
          const { error } = await supabase.from('user_wishlists').insert({
            user_id: currentUser.uid,
            product_id: product.id
          });
          
          if (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Failed to add to wishlist');
            return;
          }
        } catch (supabaseError) {
          console.error('Exception in Supabase add to wishlist:', supabaseError);
          toast.error('Failed to add to wishlist');
          return;
        }
      }
      
      setWishlist(prev => [...prev, product.id]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (currentUser) {
        try {
          const { error } = await supabase
            .from('user_wishlists')
            .delete()
            .eq('user_id', currentUser.uid)
            .eq('product_id', productId);
          
          if (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove from wishlist');
            return;
          }
        } catch (supabaseError) {
          console.error('Exception in Supabase remove from wishlist:', supabaseError);
          toast.error('Failed to remove from wishlist');
          return;
        }
      }
      
      setWishlist(prev => prev.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
