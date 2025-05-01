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

export const addCartItem = async (userId: string, productId: string, quantity: number = 1, color: string = '', size: string = ''): Promise<CartItem | null> => {
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
      .eq('id', productId)
      .single();

    if (productError) {
      console.error('Error fetching product details:', productError);
      return null;
    }

    if (!productData) {
      console.log('Product not found with ID:', productId);
      return null;
    }

    // Insert the cart item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          color: color,
          size: size
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
      console.log('Failed to add cart item for user:', userId, 'and product:', productId);
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

export const removeCartItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing cart item:', error);
      return false;
    }

    console.log('Cart item removed successfully:', itemId);
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

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem | null> => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('id', itemId)
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
      console.log('Cart item not found with ID:', itemId);
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
