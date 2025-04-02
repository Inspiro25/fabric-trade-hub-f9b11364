
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast'; 
import { SearchPageProduct } from './types';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';

export function useSearchCartIntegration() {
  const [isAddingToCart, setIsAddingToCart] = useState<boolean | string>(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean | string>(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    
    try {
      // Make sure we provide default values for required fields
      addToCart(product, 1, product.colors?.[0] || '', product.sizes?.[0] || '');
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add product to cart",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    try {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add product to wishlist",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };
  
  const handleShareProduct = (product: SearchPageProduct) => {
    const url = `${window.location.origin}/product/${product.id}`;
    
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description?.substring(0, 100) || `Check out this ${product.name}`,
          url,
        })
        .catch((error) => console.log('Error sharing:', error));
    }
    
    return url;
  };
  
  return {
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
  };
}
