
import { useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from '@/hooks/use-toast';
import { SearchPageProduct } from '@/hooks/search/types';
import { useSearchDialogs } from '@/hooks/search/use-search-dialogs';
import { useAuth } from '@/contexts/AuthContext';

export const useSearchCartIntegration = () => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { setIsDialogOpen, setIsShareDialogOpen, setShareableLink } = useSearchDialogs();
  const { currentUser } = useAuth();

  const isAuthenticated = !!currentUser;
  
  // State to track items being added to cart/wishlist
  const isAddingToCart = false;
  const isAddingToWishlist = false;

  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }

    addToCart({
      id: product.id || '',
      name: product.name || '',
      price: product.sale_price || product.price || 0,
      image: product.images?.[0] || '',
      quantity: 1,
      color: product.colors?.[0] || '',
      size: product.sizes?.[0] || '',
      category_id: product.category_id || '',
      description: product.description || '',
      rating: product.rating || 0,
      review_count: product.review_count || 0,
      shop_id: product.shop_id || '',
      is_new: product.is_new || false,
      is_trending: product.is_trending || false,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  }, [isAuthenticated, setIsDialogOpen, addToCart]);

  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    if (!isAuthenticated) {
      setIsDialogOpen(true);
      return;
    }
    
    addToWishlist(product.id || '');
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to your wishlist`,
    });
  }, [isAuthenticated, setIsDialogOpen, addToWishlist]);

  const handleShareProduct = (product: SearchPageProduct) => {
    const shareableLink = window.location.origin + '/product/' + product.id;
    setShareableLink(shareableLink);
    setIsShareDialogOpen(true);
    return shareableLink;
  };

  return {
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    isAddingToCart,
    isAddingToWishlist
  };
};
