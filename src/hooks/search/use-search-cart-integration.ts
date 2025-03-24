
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SearchPageProduct } from './types';
import { adaptProduct } from '@/lib/products/types';

export const useSearchCartIntegration = () => {
  const [isAddingToCart, setIsAddingToCart] = useState<string>('');
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string>('');
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);
    
    // Small delay to show loading state
    setTimeout(() => {
      // Convert the search product to cart item and adapt it to the Product type
      const adaptedProduct = adaptProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        salePrice: product.sale_price,
        image: product.images[0], // Use first image as thumbnail
        images: product.images,
        description: product.description || '',
        category_id: product.category_id || '',
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        stock: product.stock || 0,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        reviewCount: product.review_count || 0,
        shop_id: product.shop_id || '',
        shopId: product.shop_id || '',
        is_new: product.is_new || false,
        isNew: product.is_new || false,
        is_trending: product.is_trending || false,
        isTrending: product.is_trending || false,
        tags: product.tags || []
      });
      
      addToCart(adaptedProduct, 1, "", "");
      setIsAddingToCart('');
    }, 500);
    
    return true;
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    // Small delay to show loading state
    setTimeout(() => {
      // Convert the search product to wishlist item
      const adaptedProduct = adaptProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        salePrice: product.sale_price,
        image: product.images[0], // Use first image as thumbnail
        images: product.images,
        description: product.description || '',
        category_id: product.category_id || '',
        category: product.category_id || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        stock: product.stock || 0,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        reviewCount: product.review_count || 0,
        shop_id: product.shop_id || '',
        shopId: product.shop_id || '',
        is_new: product.is_new || false,
        isNew: product.is_new || false,
        is_trending: product.is_trending || false,
        isTrending: product.is_trending || false,
        tags: product.tags || []
      });
      
      addToWishlist(adaptedProduct);
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
