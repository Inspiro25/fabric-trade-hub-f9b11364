
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchPageProduct } from './types';

export const useSearchCartIntegration = () => {
  const [isAddingToCart, setIsAddingToCart] = useState<string>('');
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string>('');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    
    // Small delay to show loading state
    setTimeout(() => {
      // Convert the search product to cart item
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.sale_price,
        image: product.images[0], // Use first image as thumbnail
        description: product.description || '',
        images: product.images,
        category: product.category_id || '',
        categoryName: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        quantity: 1,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        shopId: product.shop_id || '',
        shopName: product.shop_id || '',
        isNew: product.is_new || false,
        isFavorite: false,
        isTrending: product.is_trending || false,
        isSale: !!product.sale_price,
        tags: product.tags || []
      };
      
      addToCart(cartItem);
      setIsAddingToCart('');
    }, 500);
    
    return true;
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    // Small delay to show loading state
    setTimeout(() => {
      // Convert the search product to wishlist item
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.sale_price,
        image: product.images[0], // Use first image as thumbnail
        description: product.description || '',
        images: product.images,
        category: product.category_id || '',
        categoryName: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        quantity: 1,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        stock: product.stock || 0,
        shopId: product.shop_id || '',
        shopName: product.shop_id || '',
        isNew: product.is_new || false,
        isFavorite: true,
        isTrending: product.is_trending || false,
        isSale: !!product.sale_price,
        tags: product.tags || []
      };
      
      addToWishlist(wishlistItem);
      setIsAddingToWishlist('');
    }, 500);
    
    return true;
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    // Create a shareable link for the product
    const shareableLink = `${window.location.origin}/product/${product.id}`;
    
    // Don't actually share here, let the parent handle it
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
