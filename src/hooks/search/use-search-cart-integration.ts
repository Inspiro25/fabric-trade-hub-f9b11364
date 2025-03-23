
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/types/product';
import { SearchPageProduct } from './types';

export const useSearchCartIntegration = () => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  
  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);

    const productForCart: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      sale_price: product.sale_price || product.salePrice,
      description: product.description || '',
      category: product.category_id || product.category || '',
      category_id: product.category_id || product.category || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
      rating: product.rating || 0,
      reviewCount: product.review_count || product.reviewCount || 0,
      review_count: product.review_count || product.reviewCount || 0,
      shopId: product.shop_id || product.shopId || null,
      shop_id: product.shop_id || product.shopId || null,
      isNew: product.is_new || product.isNew || false,
      is_new: product.is_new || product.isNew || false,
      isTrending: product.is_trending || product.isTrending || false,
      is_trending: product.is_trending || product.isTrending || false,
      tags: product.tags || []
    };

    // Add empty string for color and size since these are required by the addToCart function
    // The cart context expects 4 arguments: product, quantity, color, and size
    addToCart(productForCart, 1, '', '');
    
    setTimeout(() => {
      setIsAddingToCart(null);
      // We're not calling toast here anymore as the toast will be triggered in the CartContext
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    // Create a proper product object for the wishlist
    const productForWishlist: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      sale_price: product.sale_price || product.salePrice,
      description: product.description || '',
      category: product.category_id || product.category || '',
      category_id: product.category_id || product.category || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
      rating: product.rating || 0,
      reviewCount: product.review_count || product.reviewCount || 0,
      review_count: product.review_count || product.reviewCount || 0,
      shopId: product.shop_id || product.shopId || null,
      shop_id: product.shop_id || product.shopId || null,
      isNew: product.is_new || product.isNew || false,
      is_new: product.is_new || product.isNew || false,
      isTrending: product.is_trending || product.isTrending || false,
      is_trending: product.is_trending || product.isTrending || false,
      tags: product.tags || []
    };
    
    setTimeout(() => {
      addToWishlist(productForWishlist);
      setIsAddingToWishlist(null);
      // We're not calling toast here anymore as the toast will be triggered in the WishlistContext
    }, 500);
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    const shareableLink = window.location.origin + '/product/' + product.id;
    return shareableLink;
  };

  return {
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct
  };
};
