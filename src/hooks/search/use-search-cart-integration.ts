
import { useState, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchPageProduct } from './types';
import { Product } from '@/lib/products/types';

export const useSearchCartIntegration = () => {
  const { addToCart } = useCart();
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
      category: searchProduct.category || '',
      category_id: searchProduct.category_id || '',
      rating: searchProduct.rating || 0,
      reviewCount: searchProduct.reviewCount || 0,
      review_count: searchProduct.reviewCount || 0,
      stock: searchProduct.stock || 0,
      colors: searchProduct.colors || [],
      sizes: searchProduct.sizes || [],
      tags: searchProduct.tags || [],
      shop_id: searchProduct.shopId || '',
      shopId: searchProduct.shopId || ''
    };
  };
  
  const handleAddToCart = (product: SearchPageProduct) => {
    const convertedProduct = convertToProduct(product);
    addToCart(
      convertedProduct.id,
      convertedProduct.name,
      convertedProduct.images[0] || '',
      convertedProduct.sale_price || convertedProduct.price,
      convertedProduct.stock,
      convertedProduct.shop_id || '',
      convertedProduct.sale_price || null
    );
  };
  
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
    isAddingToWishlist,
    copiedLink
  };
};
