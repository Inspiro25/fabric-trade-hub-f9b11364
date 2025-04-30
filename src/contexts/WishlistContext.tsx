
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

type WishlistItem = Product;

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product | string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
  wishlist: string[]; // Array of product IDs for compatibility
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Derived state - extract IDs for compatibility with existing code
  const wishlist = wishlistItems.map(item => item.id);

  // Define isInWishlist function first before using it anywhere else
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Load wishlist data from Supabase or localStorage
  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser) {
          // Fetch from Supabase if user is logged in
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('product_id, product:products(*)')
            .eq('user_id', currentUser.id);
            
          if (error) throw error;
          
          // Transform data to WishlistItem format
          const items: WishlistItem[] = data
            .filter(item => item.product) // Filter out items with no product
            .map(item => item.product as unknown as Product);
            
          setWishlistItems(items);
        } else {
          // Load from localStorage for guest users
          const storedWishlist = localStorage.getItem('guest_wishlist');
          if (storedWishlist) {
            setWishlistItems(JSON.parse(storedWishlist));
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlist();
  }, [currentUser]);

  // Save wishlist to localStorage (for guest users only)
  useEffect(() => {
    if (!currentUser && wishlistItems.length > 0) {
      localStorage.setItem('guest_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, currentUser]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productOrId: Product | string) => {
    let product: Product;
    let productId: string;
    
    if (typeof productOrId === 'string') {
      productId = productOrId;
      // If only ID is provided, try to find the product in the existing wishlist
      const existingProduct = wishlistItems.find(item => item.id === productId);
      if (existingProduct) {
        product = existingProduct;
      } else {
        // Fetch product from Supabase
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
            
          if (error || !data) throw error;
          product = data as unknown as Product;
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to add item to wishlist');
          return;
        }
      }
    } else {
      product = productOrId;
      productId = product.id;
    }
    
    // Check if item is already in wishlist
    if (isInWishlist(productId)) {
      toast.info('Item is already in your wishlist');
      return;
    }
    
    // Add to Supabase if user is logged in
    if (currentUser) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: currentUser.id,
            product_id: productId,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        toast.error('Failed to add item to wishlist');
        return;
      }
    }
    
    // Update local state
    setWishlistItems(prev => [...prev, product]);
    toast.success('Added to wishlist');
  }, [wishlistItems, currentUser, isInWishlist]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    // Remove from Supabase if user is logged in
    if (currentUser) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        toast.error('Failed to remove item from wishlist');
        return;
      }
    }
    
    // Update local state
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Removed from wishlist');
  }, [currentUser]);

  // Clear the entire wishlist
  const clearWishlist = useCallback(async () => {
    // Clear from Supabase if user is logged in
    if (currentUser) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', currentUser.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast.error('Failed to clear wishlist');
        return;
      }
    } else {
      // Clear from localStorage for guest users
      localStorage.removeItem('guest_wishlist');
    }
    
    // Update local state
    setWishlistItems([]);
    toast.success('Wishlist cleared');
  }, [currentUser]);
  
  // Combine guest wishlist with user wishlist on login
  useEffect(() => {
    const migrateGuestWishlist = async () => {
      if (currentUser) {
        const guestWishlist = localStorage.getItem('guest_wishlist');
        
        if (guestWishlist) {
          try {
            const guestItems: WishlistItem[] = JSON.parse(guestWishlist);
            
            // Get current user wishlist items to avoid duplicates
            const { data: existingItems, error: fetchError } = await supabase
              .from('wishlist_items')
              .select('product_id')
              .eq('user_id', currentUser.id);
              
            if (fetchError) throw fetchError;
            
            const existingProductIds = existingItems.map(item => item.product_id);
            
            // Filter out items already in user's wishlist
            const newItems = guestItems.filter(item => !existingProductIds.includes(item.id));
            
            // Insert new items into database
            if (newItems.length > 0) {
              const itemsToInsert = newItems.map(item => ({
                user_id: currentUser.id,
                product_id: item.id,
                created_at: new Date().toISOString()
              }));
              
              const { error: insertError } = await supabase
                .from('wishlist_items')
                .insert(itemsToInsert);
                
              if (insertError) throw insertError;
              
              toast.success('Your guest wishlist items have been saved to your account');
            }
            
            // Clear guest wishlist in localStorage
            localStorage.removeItem('guest_wishlist');
          } catch (error) {
            console.error('Error migrating guest wishlist:', error);
          }
        }
      }
    };
    
    migrateGuestWishlist();
  }, [currentUser]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading,
        wishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
