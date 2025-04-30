
import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchPageProduct } from './types';
import { Product } from '@/lib/products/types';

export const useSearchCartIntegration = () => {
  const { addToCart, isAdding: isAddingToCart } = useCart();
  const { addToWishlist, isAddingToWishlist } = useWishlist();
  
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Helper to convert SearchPageProduct to Product
  const convertToProduct = (searchProduct: SearchPageProduct): Product => {
    return {
      id: searchProduct.id,
      name: searchProduct.name,
      description: searchProduct.description || '',
      price: searchProduct.price,
      salePrice: searchProduct.salePrice,
      sale_price: searchProduct.salePrice,
      images: searchProduct.images || (searchProduct.image ? [searchProduct.image] : []),
      category: searchProduct.category,
      category_id: searchProduct.category_id,
      rating: searchProduct.rating,
      reviewCount: searchProduct.reviewCount,
      review_count: searchProduct.reviewCount,
      stock: searchProduct.stock || 10,
      shop_id: searchProduct.shop_id || searchProduct.shopId,
      colors: searchProduct.colors || [],
      sizes: searchProduct.sizes || [],
      tags: searchProduct.tags || []
    };
  };
  
  // Handler for adding to cart
  const handleAddToCart = useCallback((product: SearchPageProduct) => {
    const fullProduct = convertToProduct(product);
    addToCart(fullProduct, 1, '', '');
  }, [addToCart]);
  
  // Handler for adding to wishlist
  const handleAddToWishlist = useCallback((product: SearchPageProduct) => {
    const fullProduct = convertToProduct(product);
    addToWishlist(fullProduct);
  }, [addToWishlist]);
  
  // Handler for sharing product
  const handleShareProduct = useCallback((product: SearchPageProduct) => {
    try {
      const url = `${window.location.origin}/product/${product.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(product.id);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, []);
  
  return {
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    isAddingToCart,
    isAddingToWishlist,
    copiedLink
  };
};
