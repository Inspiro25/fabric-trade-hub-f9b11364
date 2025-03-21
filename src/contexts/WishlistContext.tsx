
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, updateDoc, getDoc, setDoc, arrayUnion, arrayRemove } from '@/lib/firebase';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  
  const { currentUser } = useAuth();

  // Fetch wishlist from database when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        try {
          const wishlistDoc = await getDoc(doc(db, 'wishlists', currentUser.uid));
          
          if (wishlistDoc.exists()) {
            const data = wishlistDoc.data();
            setWishlist(data.items || []);
          } else {
            // If no wishlist in database but we have items in localStorage, save them
            if (wishlist.length > 0) {
              await setDoc(doc(db, 'wishlists', currentUser.uid), {
                userId: currentUser.uid,
                items: wishlist
              });
            } else {
              // Initialize empty wishlist for new users
              await setDoc(doc(db, 'wishlists', currentUser.uid), {
                userId: currentUser.uid,
                items: []
              });
            }
          }
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      } else {
        // If user logs out, use localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      }
    };
    
    fetchWishlist();
  }, [currentUser]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = async (productId: string) => {
    if (wishlist.includes(productId)) return;
    
    const newWishlist = [...wishlist, productId];
    setWishlist(newWishlist);
    
    // Save to database if user is logged in
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'wishlists', currentUser.uid), {
          items: arrayUnion(productId)
        });
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId);
    setWishlist(newWishlist);
    
    // Update database if user is logged in
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'wishlists', currentUser.uid), {
          items: arrayRemove(productId)
        });
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
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
