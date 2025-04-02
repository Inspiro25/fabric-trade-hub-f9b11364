import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { Product } from '@/lib/types/product';
import AuthDialog from '@/components/search/AuthDialog';
import { firebaseUIDToUUID } from '@/utils/format';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (product: Product | string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook
  
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
              
              const localWishlist = localStorage.getItem('wishlist');
              if (localWishlist) {
                const parsedLocalWishlist = JSON.parse(localWishlist);
                const newItems = parsedLocalWishlist.filter((id: string) => !productIds.includes(id));
                
                for (const productId of newItems) {
                  try {
                    await supabase.from('user_wishlists').insert({
                      user_id: currentUser.uid,
                      product_id: productId
                    });
                  } catch (insertError) {
                    console.error('Error syncing wishlist item to database:', insertError);
                  }
                }
                
                setWishlist([...productIds, ...newItems]);
              }
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
    if (!isLoading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoading]);

  const handleLogin = useCallback(() => {
    navigate('/auth/login');
  }, [navigate]);

  const addToWishlist = useCallback(async (product: Product | string) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }

    try {
      const productId = typeof product === 'string' ? product : product.id;
      
      if (wishlist.includes(productId)) {
        toast.info("Item already in wishlist");
        return;
      }
      
      // Update local state first for better UX
      setWishlist(prev => [...prev, productId]);
      
      const { error } = await supabase.from('user_wishlists').insert({
        user_id: currentUser.uid,
        product_id: productId
      });
      
      if (error) {
        console.error('Error adding to wishlist:', error);
        // Revert local state if server update fails
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.error('Failed to add to wishlist');
        return;
      }
      
      toast.success('Added to wishlist');
      
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert local state on error
      setWishlist(prev => prev.filter(id => id !== productId));
      toast.error('Failed to add to wishlist');
    }
  }, [wishlist, currentUser]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!currentUser) {
      setShowAuthDialog(true);
      return;
    }

    try {
      // Update local state first for better UX
      setWishlist(prev => prev.filter(id => id !== productId));
      
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', currentUser.uid)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error removing from wishlist:', error);
        // Revert local state if server update fails
        setWishlist(prev => [...prev, productId]);
        toast.error('Failed to remove from wishlist');
        return;
      }
      
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Revert local state on error
      setWishlist(prev => [...prev, productId]);
      toast.error('Failed to remove from wishlist');
    }
  }, [currentUser]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      isLoading 
    }}>
      {children}
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Limited Functionality"
          message="Sign in to save your wishlist and access more features."
        />
      )}
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

const fetchWishlist = async (userId: string) => {
  if (!currentUser?.uid) return;
  
  try {
    const supabaseUUID = firebaseUIDToUUID(currentUser.uid);
    
    const { data, error } = await supabase
      .from('user_wishlists')
      .select('product_id')
      .eq('user_id', supabaseUUID);
  
    if (error) throw error;
    return data?.map(item => item.product_id) || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};
