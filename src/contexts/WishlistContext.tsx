
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types/product';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false,
  isAddingToWishlist: false,
  isRemovingFromWishlist: false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();

  // Fetch wishlist from database (if logged in) or localStorage (if not logged in)
  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated && currentUser?.id) {
      try {
        const { data, error } = await supabase
          .from('user_wishlists')
          .select('product_id, products(*)')
          .eq('user_id', currentUser.id);

        if (error) {
          console.error('Error fetching wishlist:', error);
          return;
        }

        if (data && data.length > 0) {
          const wishlistItems = data.map((item) => {
            if (item.products) {
              return {
                id: item.products.id,
                name: item.products.name,
                price: item.products.price,
                sale_price: item.products.sale_price,
                salePrice: item.products.sale_price,
                images: item.products.images,
                description: item.products.description,
                category_id: item.products.category_id,
                category: item.products.category,
                colors: item.products.colors,
                sizes: item.products.sizes,
                stock: item.products.stock,
                rating: item.products.rating,
                review_count: item.products.review_count,
                reviewCount: item.products.review_count,
                shop_id: item.products.shop_id,
                shopId: item.products.shop_id,
                is_new: item.products.is_new,
                isNew: item.products.is_new,
                is_trending: item.products.is_trending,
                isTrending: item.products.is_trending,
                tags: item.products.tags,
              } as Product;
            }
            return null;
          }).filter(Boolean) as Product[];

          setWishlist(wishlistItems);
        }
      } catch (error) {
        console.error('Error in fetchWishlist:', error);
      }
    } else {
      // Use localStorage if not logged in
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
          localStorage.removeItem('wishlist');
        }
      }
    }
  }, [currentUser?.id, isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add product to wishlist
  const addToWishlist = async (product: Product) => {
    setIsAddingToWishlist(true);
    try {
      // Check if product is already in wishlist
      if (wishlist.some((item) => item.id === product.id)) {
        toast.info('Product already in wishlist');
        return;
      }

      if (isAuthenticated && currentUser?.id) {
        // Add to database
        const { error } = await supabase.from('user_wishlists').insert({
          user_id: currentUser.id,
          product_id: product.id,
        });

        if (error) {
          console.error('Error adding to wishlist:', error);
          toast.error('Failed to add to wishlist');
          return;
        }
      } else {
        // Add to localStorage
        const updatedWishlist = [...wishlist, product];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }

      // Update state
      setWishlist((prevWishlist) => [...prevWishlist, product]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error in addToWishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId: string) => {
    setIsRemovingFromWishlist(true);
    try {
      if (isAuthenticated && currentUser?.id) {
        // Remove from database
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);

        if (error) {
          console.error('Error removing from wishlist:', error);
          toast.error('Failed to remove from wishlist');
          return;
        }
      } else {
        // Remove from localStorage
        const updatedWishlist = wishlist.filter((item) => item.id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }

      // Update state
      setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error in removeFromWishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsRemovingFromWishlist(false);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      if (isAuthenticated && currentUser?.id) {
        // Clear from database
        const { error } = await supabase
          .from('user_wishlists')
          .delete()
          .eq('user_id', currentUser.id);

        if (error) {
          console.error('Error clearing wishlist:', error);
          toast.error('Failed to clear wishlist');
          return;
        }
      } else {
        // Clear from localStorage
        localStorage.removeItem('wishlist');
      }

      // Update state
      setWishlist([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error in clearWishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const contextValue: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  };

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>;
};
