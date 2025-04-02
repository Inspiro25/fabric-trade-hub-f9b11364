
import { useState } from 'react';
import { toast } from 'sonner';
import { SearchPageProduct } from '@/hooks/search/types';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import useAuthDialog from './use-auth-dialog';

export function useSearchCartIntegration() {
  const [isAddingToCart, setIsAddingToCart] = useState<string | boolean>(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | boolean>(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { openAuthDialog } = useAuthDialog();
  
  const handleAddToCart = (product: SearchPageProduct) => {
    if (!product.id) return;
    
    try {
      setIsAddingToCart(product.id);
      
      if (isInCart(product.id)) {
        toast("Already in cart", {
          description: "This product is already in your cart",
          action: {
            label: "View Cart",
            onClick: () => window.location.href = "/cart"
          },
        });
        return;
      }
      
      // Add to cart with default color/size if product has them
      addToCart({
        ...product,
        colors: product.colors || [],
        sizes: product.sizes || [],
        rating: product.rating || 0,
        stock: product.stock || 0,
        tags: product.tags || []
      } as any, 1);
      
      toast("Added to cart", {
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast("Error", {
        description: "Could not add to cart. Please try again.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleAddToWishlist = (product: SearchPageProduct) => {
    if (!product.id) return;
    
    try {
      setIsAddingToWishlist(product.id);
      
      if (isInWishlist(product.id)) {
        toast("Already in wishlist", {
          description: "This product is already in your wishlist",
          action: {
            label: "View Wishlist",
            onClick: () => window.location.href = "/wishlist"
          },
        });
        return;
      }
      
      addToWishlist(product.id);
      
      toast("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast("Error", {
        description: "Could not add to wishlist. Please try again.",
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };
  
  const handleShareProduct = (product: SearchPageProduct) => {
    if (!product.id) return;
    
    navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
    
    toast("Link copied", {
      description: "Product link copied to clipboard",
    });
  };
  
  return {
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    isAddingToCart,
    isAddingToWishlist
  };
}
