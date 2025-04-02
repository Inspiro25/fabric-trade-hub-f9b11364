
import { useContext } from 'react';
import { WishlistContext } from '@/contexts/WishlistContext';
import { Product } from '@/lib/products/types';
import { toast } from 'sonner';

export const useWishlist = () => {
  const wishlistContext = useContext(WishlistContext);
  
  if (!wishlistContext) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  const addToWishlist = (product: Product | string) => {
    wishlistContext.addToWishlist(product);
    toast.success(typeof product === 'string' ? 'Added to wishlist' : `${product.name} added to wishlist`);
  };
  
  const removeFromWishlist = (productId: string) => {
    wishlistContext.removeFromWishlist(productId);
    toast.info('Removed from wishlist');
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistContext.isInWishlist(productId);
  };
  
  return {
    ...wishlistContext,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};

export default useWishlist;
