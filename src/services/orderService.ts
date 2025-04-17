import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { Order } from '@/types/order';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

// Cache orders for better performance
let ordersCache: { [userId: string]: { data: Order[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create new order
export const createOrder = async (
  userId: string,
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
  }>,
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  },
  paymentMethod: string,
  paymentId: string,
  total: number
): Promise<string | null> => {
  try {
    // First, get shop information from the first product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('shop_id')
      .eq('id', items[0].productId)
      .single();

    if (productError) {
      console.error('Error fetching product shop info:', productError);
      throw productError;
    }

    // Create the order with shop information
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        shop_id: productData.shop_id,
        status: 'pending',
        total: total,
        payment_method: paymentMethod,
        payment_id: paymentId,
        payment_status: 'completed',
        shipping_address: shippingAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items with product references
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      color: item.color,
      size: item.size,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Attempt to delete the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Create notification for user
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'order_created',
      title: 'Order Placed Successfully',
      message: `Your order #${order.id.slice(0, 8)} has been placed.`,
      read: false,
      created_at: new Date().toISOString()
    });

    // Create notification for shop owner
    const { data: shopOwner, error: shopOwnerError } = await supabase
      .from('shops')
      .select('user_id')
      .eq('id', productData.shop_id)
      .single();

    if (!shopOwnerError && shopOwner) {
      await supabase.from('notifications').insert({
        user_id: shopOwner.user_id,
        type: 'new_order',
        title: 'New Order Received',
        message: `New order #${order.id.slice(0, 8)} has been placed.`,
        read: false,
        created_at: new Date().toISOString()
      });
    }

    // Update product stock
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('update_product_stock', {
        p_id: item.productId,
        quantity: item.quantity
      });

      if (stockError) {
        console.error('Error updating product stock:', stockError);
      }
    }

    // Invalidate caches
    invalidateOrdersCache(userId);
    if (shopOwner) {
      invalidateOrdersCache(shopOwner.user_id);
    }

    return order.id;
  } catch (error) {
    console.error('Error in createOrder:', error);
    toast({
      title: "Error creating order",
      description: "There was a problem creating your order. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

// Get user orders
export const getOrders = async (userId: string): Promise<Order[]> => {
  // Check cache first
  const cached = ordersCache[userId];
  const now = Date.now();
  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }

  try {
    // First check if user is a shop owner
    const { data: shopData } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', userId)
      .single();

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          id,
          quantity,
          price,
          color,
          size,
          total,
          product:products (
            id,
            name,
            images,
            price,
            sale_price
          )
        )
      `)
      .order('created_at', { ascending: false });

    // If user is a shop owner, get orders for their shop
    if (shopData) {
      query = query.eq('shop_id', shopData.id);
    } else {
      // Otherwise get user's orders
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    // Format the data to match the Order type
    const formattedOrders = data.map(order => ({
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        product: {
          ...item.product,
          salePrice: item.product.sale_price
        }
      }))
    }));

    // Update cache
    ordersCache[userId] = {
      data: formattedOrders,
      timestamp: now
    };

    return formattedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast({
      title: "Error loading orders",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
};

// Get order by id
export const getOrderById = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (
        *,
        product:products (*)
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw error;
  }

  return data;
};

// Cancel order
export const cancelOrder = async (orderId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }

    // Invalidate cache after cancelling order
    invalidateOrdersCache(userId);

    toast({
      title: "Order cancelled",
      description: "Your order has been cancelled successfully",
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    toast({
      title: "Error cancelling order",
      description: "Please try again later",
      variant: "destructive",
    });
  }
};

export const initiateReturn = async (orderId: string, reason: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'returned',
        return_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error initiating return:', error);
      throw error;
    }

    // Invalidate cache after initiating return
    invalidateOrdersCache(userId);

    toast({
      title: "Return initiated",
      description: "Your return request has been submitted",
    });
  } catch (error) {
    console.error('Error initiating return:', error);
    toast({
      title: "Error initiating return",
      description: "Please try again later",
      variant: "destructive",
    });
  }
};

export const getOrdersByStatus = async (userId: string, status: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }

  return data || [];
};

export const invalidateOrdersCache = (userId: string) => {
  delete ordersCache[userId];
};
