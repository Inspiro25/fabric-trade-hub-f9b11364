
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/products/types';
import { SearchPageProduct } from './types';

export const useSearchCartIntegration = () => {
  const navigate = useNavigate();
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
      category_id: product.category_id || product.category || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
      rating: product.rating || 0,
      review_count: product.review_count || product.reviewCount || 0,
      shop_id: product.shop_id || product.shopId || null,
      is_new: product.is_new || product.isNew || false,
      is_trending: product.is_trending || product.isTrending || false,
      tags: product.tags || []
    };

    addToCart(productForCart, 1);
    
    setTimeout(() => {
      setIsAddingToCart(null);
      toast(`${product.name} added to cart`, {
        description: "You can view it in your cart",
        action: {
          label: "View Cart",
          onClick: () => navigate('/cart')
        },
        // These arguments are required to fix the toast error
        duration: 3000,
        dismissible: true
      });
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    setTimeout(() => {
      addToWishlist(product.id);
      setIsAddingToWishlist(null);
      toast(`${product.name} added to wishlist`, {
        description: "You can view it in your wishlist",
        action: {
          label: "View Wishlist",
          onClick: () => navigate('/wishlist')
        },
        // These arguments are required to fix the toast error
        duration: 3000,
        dismissible: true
      });
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
