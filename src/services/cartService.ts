
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (
          id,
          name,
          description,
          price,
          salePrice: sale_price,
          images,
          category,
          colors,
          sizes,
          isNew,
          isTrending,
          rating,
          reviewCount: review_count,
          stock,
          tags,
          shopId: shop_id
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    if (!data) {
      console.log('No cart items found for user:', userId);
      return [];
    }

    const cartItems: CartItem[] = data.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      image: item.product.images[0] || '',
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      product: item.product,
      stock: item.product.stock,
      shopId: item.product.shopId
    }));

    return cartItems;
  } catch (error) {
    console.error('Error in getCartItems:', error);
    return [];
  }
};

// Alias these functions for compatibility with cart-operations
export const fetchUserCart = getCartItems;
export const upsertCartItem = addCartItem;
export const clearUserCart = clearCart;

export const addCartItem = async (cartData: { 
  user_id: string, 
  product_id: string, 
  quantity: number, 
  color?: string, 
  size?: string 
}): Promise<CartItem | null> => {
  try {
    // Fetch the product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        salePrice: sale_price,
        images,
        category,
        colors,
        sizes,
        isNew,
        isTrending,
        rating,
        reviewCount: review_count,
        stock,
        tags,
        shopId: shop_id
      `)
      .eq('id', cartData.product_id)
      .single();

    if (productError) {
      console.error('Error fetching product details:', productError);
      return null;
    }

    if (!productData) {
      console.log('Product not found with ID:', cartData.product_id);
      return null;
    }

    // Insert the cart item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: cartData.user_id,
          product_id: cartData.product_id,
          quantity: cartData.quantity,
          color: cartData.color || '',
          size: cartData.size || ''
        }
      ])
      .select(`
        *,
        product:products (
          id,
          name,
          description,
          price,
          salePrice: sale_price,
          images,
          category,
          colors,
          sizes,
          isNew,
          isTrending,
          rating,
          reviewCount: review_count,
          stock,
          tags,
          shopId: shop_id
        )
      `)
      .single();

    if (error) {
      console.error('Error adding cart item:', error);
      return null;
    }

    if (!data) {
      console.log('Failed to add cart item for user:', cartData.user_id, 'and product:', cartData.product_id);
      return null;
    }

    // Transform the data to match CartItem
    const cartItem: CartItem = {
      id: data.id,
      productId: data.product_id,
      name: data.product.name,
      image: data.product.images[0] || '',
      price: data.product.price,
      salePrice: data.product.salePrice,
      quantity: data.quantity,
      color: data.color,
      size: data.size,
      product: data.product,
      stock: data.product.stock,
      shopId: data.product.shopId
    };

    return cartItem;
  } catch (error) {
    console.error('Error in addCartItem:', error);
    return null;
  }
};

export const removeCartItem = async (userId: string, productId: string, size: string = '', color: string = ''): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color);

    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }

    console.log('Cart item removed successfully');
    return true;
  } catch (error) {
    console.error('Error in removeCartItem:', error);
    return false;
  }
};

export const clearCart = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

    console.log('Cart cleared successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Error in clearCart:', error);
    return false;
  }
};

export const updateCartItemQuantity = async (userId: string, productId: string, size: string = '', color: string = '', quantity: number): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .select(`
        *,
        product:products (
          id,
          name,
          description,
          price,
          salePrice: sale_price,
          images,
          category,
          colors,
          sizes,
          isNew,
          isTrending,
          rating,
          reviewCount: review_count,
          stock,
          tags,
          shopId: shop_id
        )
      `)
      .single();

    if (error) {
      console.error('Error updating cart item quantity:', error);
      return null;
    }

    if (!data) {
      console.log('Cart item not found');
      return null;
    }

    const cartItem: CartItem = {
      id: data.id,
      productId: data.product_id,
      name: data.product.name,
      image: data.product.images[0] || '',
      price: data.product.price,
      salePrice: data.product.salePrice,
      quantity: data.quantity,
      color: data.color,
      size: data.size,
      product: data.product,
      stock: data.product.stock,
      shopId: data.product.shopId
    };

    return cartItem;
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    return null;
  }
};

export const getCartTotal = async (userId: string): Promise<number> => {
    try {
        const cartItems = await getCartItems(userId);
        let total = 0;
        for (const item of cartItems) {
            total += (item.salePrice || item.price) * item.quantity;
        }
        return total;
    } catch (error) {
        console.error("Error calculating cart total:", error);
        return 0;
    }
};

export const getCartCount = async (userId: string): Promise<number> => {
    try {
        const cartItems = await getCartItems(userId);
        let count = 0;
        for (const item of cartItems) {
            count += item.quantity;
        }
        return count;
    } catch (error) {
        console.error("Error calculating cart count:", error);
        return 0;
    }
};
