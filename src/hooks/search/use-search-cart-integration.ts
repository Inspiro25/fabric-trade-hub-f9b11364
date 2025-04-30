
import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchPageProduct } from './types';

export const useSearchCartIntegration = () => {
  const { addToCart, isAdding: isAddingToCart } = useCart();
  const { addToWishlist, isAddingToWishlist } = useWishlist();
  
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Handler for adding a product to cart
  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || product.sale_price,
      quantity: 1,
      image: product.images?.[0] || '',
      color: product.colors?.[0] || '',
      size: product.sizes?.[0] || '',
      // Use shop_id if available, fallback to shopId
      shopId: product.shop_id || product.shopId || '',
      shop_id: product.shop_id || product.shopId || '',
      stock: product.stock || 0
    };
    
    addToCart(cartItem);
  }, [addToCart]);
  
  // Handler for adding a product to wishlist
  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    if (!product) return;
    
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || product.sale_price,
      image: product.images?.[0] || '',
      category: product.category || '',
      rating: product.rating || 0,
      // Use shop_id if available, fallback to shopId
      shopId: product.shop_id || product.shopId || '',
      shop_id: product.shop_id || product.shopId || '',
    };
    
    addToWishlist(wishlistItem);
  }, [addToWishlist]);
  
  // Handler for sharing a product
  const handleShareProduct = useCallback((product: SearchPageProduct) => {
    if (!product) return '';
    
    const shareableLink = `${window.location.origin}/product/${product.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopiedLink(shareableLink);
        setTimeout(() => setCopiedLink(null), 3000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
    
    return shareableLink;
  }, []);
  
  return {
    isAddingToCart,
    isAddingToWishlist,
    copiedLink,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct
  };
};
