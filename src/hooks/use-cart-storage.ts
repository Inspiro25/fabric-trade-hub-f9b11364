
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  productId: string;
  quantity: number;
  productName: string;
  productImage: string;
  thumbnailUrl: string;
  price: number;
  stock: number;
  shopId: string;
  salePrice: number | null;
}

const useCartStorage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    syncCartWithDatabase();
  }, [cart, currentUser]);

  const syncCartWithDatabase = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // Fetch products for each cart item
      const productIds = cart.map(item => item.productId);
      
      if (productIds.length === 0) return;
      
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, price, sale_price, images, stock, shop_id')
        .in('id', productIds);
      
      if (error) {
        throw error;
      }
      
      if (!products || products.length === 0) return;

      // Update cart items with current product data
      const updatedCart = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        
        if (!product) return item;
        
        return {
          ...item,
          productName: product.name,
          productImage: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
          thumbnailUrl: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
          price: product.sale_price || product.price,
          stock: product.stock || 0,
          shopId: product.shop_id,
          salePrice: product.sale_price || null
        };
      });
      
      setCart(updatedCart);
    } catch (error) {
      console.error('Error syncing cart data:', error);
    }
  }, [cart, setCart, currentUser]);

  const addToCart = (productId: string, productName: string, productImage: string, price: number, stock: number, shopId: string, salePrice: number | null) => {
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      if (updatedCart[existingItemIndex].quantity < stock) {
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      }
    } else {
      if (stock > 0) {
        const newItem: CartItem = {
          productId,
          quantity: 1,
          productName,
          productImage,
          thumbnailUrl: productImage,
          price,
          stock,
          shopId,
          salePrice
        };
        setCart([...cart, newItem]);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
  };

  const increaseQuantity = (productId: string) => {
    const updatedCart = cart.map(item => {
      if (item.productId === productId && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decreaseQuantity = (productId: string) => {
    const updatedCart = cart.map(item => {
      if (item.productId === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
  };
};

export default useCartStorage;
