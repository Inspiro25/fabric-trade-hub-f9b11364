
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { toast } from 'sonner';

export interface Order {
  id: string;
  status: string;
  total: number;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

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

// Create new order
export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  total: number,
  shippingAddressId: string,
  paymentMethod: string,
  couponId?: string,
  discountAmount?: number,
  notes?: string
): Promise<string | null> => {
  try {
    // Get user information for the order
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
    }
    
    // Get shipping address details
    const { data: addressData, error: addressError } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', shippingAddressId)
      .single();
    
    if (addressError) {
      console.error('Error fetching shipping address:', addressError);
    }
    
    // Get first product to determine shop ID
    const firstItem = cartItems[0];
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('shop_id')
      .eq('id', firstItem.product.id)
      .single();
    
    if (productError) {
      console.error('Error fetching product shop ID:', productError);
    }
    
    // Format shipping address for storage
    let shippingAddressText = '';
    if (addressData) {
      shippingAddressText = `${addressData.name}\n${addressData.address_line1}`;
      if (addressData.address_line2) {
        shippingAddressText += `\n${addressData.address_line2}`;
      }
      shippingAddressText += `\n${addressData.city}, ${addressData.state} ${addressData.postal_code}\n${addressData.country}`;
    }
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        shop_id: productData?.shop_id,
        status: 'pending',
        total: total,
        shipping_address_id: shippingAddressId,
        payment_method: paymentMethod,
        notes: notes,
        customer_name: userData?.display_name || '',
        customer_email: userData?.email || '',
        customer_phone: userData?.phone || '',
        shipping_address: shippingAddressText,
        shipping_method: 'Standard Shipping',
        payment_status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }
    
    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.salePrice || item.product.price,
      color: item.color,
      size: item.size
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return null;
    }
    
    // If coupon was used, record it
    if (couponId && discountAmount) {
      const { error: couponError } = await supabase
        .from('order_coupon_usage')
        .insert({
          order_id: order.id,
          coupon_id: couponId,
          discount_applied: discountAmount
        });
      
      if (couponError) {
        console.error('Error recording coupon usage:', couponError);
        // Non-critical, continue
      }
    }
    
    // Clear cart
    const { error: clearCartError } = await supabase
      .from('user_cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('saved_for_later', false);
    
    if (clearCartError) {
      console.error('Error clearing cart after order:', clearCartError);
      // Non-critical, continue
    }
    
    // Create notification for order
    const { error: notificationError } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        title: 'Order Placed',
        message: `Your order #${order.id.slice(0, 8)} has been placed successfully.`,
        type: 'order',
        link: `/orders/${order.id}`,
        read: false
      });
    
    if (notificationError) {
      console.error('Error creating order notification:', notificationError);
      // Non-critical, continue
    }
    
    // Create notification for shop admin
    if (productData?.shop_id) {
      // Get shop admins
      const { data: shopAdmins, error: adminsError } = await supabase
        .from('shop_admins')
        .select('user_id')
        .eq('shop_id', productData.shop_id);
      
      if (!adminsError && shopAdmins?.length) {
        // Create notification for each shop admin
        for (const admin of shopAdmins) {
          await supabase
            .from('user_notifications')
            .insert({
              user_id: admin.user_id,
              title: 'New Order Received',
              message: `A new order #${order.id.slice(0, 8)} has been placed.`,
              type: 'order',
              link: `/admin/dashboard`,
              read: false
            });
        }
      }
    }
    
    toast.success('Order placed successfully!');
    return order.id;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to place order. Please try again.');
    return null;
  }
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    // Format data
    const orders = await Promise.all(data.map(async order => {
      // Get product details for each item
      const itemsWithProducts = await Promise.all(order.items.map(async (item: any) => {
        const { data: product } = await supabase
          .from('products')
          .select('name, images')
          .eq('id', item.product_id)
          .single();
        
        return {
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          productName: product?.name || 'Product',
          productImage: product?.images?.[0] || '',
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        };
      }));
      
      // Get shipping address if available
      let shippingAddress = undefined;
      if (order.shipping_address_id) {
        const { data: address } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('id', order.shipping_address_id)
          .single();
        
        if (address) {
          shippingAddress = {
            id: address.id,
            name: address.name,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country
          };
        }
      }
      
      return {
        id: order.id,
        status: order.status,
        total: order.total,
        paymentMethod: order.payment_method,
        trackingNumber: order.tracking_number,
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: itemsWithProducts,
        shippingAddress
      };
    }));
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Get order by id
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError) {
      console.error('Error fetching order:', orderError);
      return null;
    }
    
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return null;
    }
    
    // Get product details for each item
    const itemsWithProducts = await Promise.all(items.map(async (item) => {
      const { data: product } = await supabase
        .from('products')
        .select('name, images')
        .eq('id', item.product_id)
        .single();
      
      return {
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        productName: product?.name || 'Product',
        productImage: product?.images?.[0] || '',
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size
      };
    }));
    
    // Get shipping address if available
    let shippingAddress = undefined;
    if (order.shipping_address_id) {
      const { data: address } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('id', order.shipping_address_id)
        .single();
      
      if (address) {
        shippingAddress = {
          id: address.id,
          name: address.name,
          addressLine1: address.address_line1,
          addressLine2: address.address_line2,
          city: address.city,
          state: address.state,
          postalCode: address.postal_code,
          country: address.country
        };
      }
    }
    
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      paymentMethod: order.payment_method,
      trackingNumber: order.tracking_number,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: itemsWithProducts,
      shippingAddress
    };
  } catch (error) {
    console.error('Error fetching order by id:', error);
    return null;
  }
};

// Cancel order
export const cancelOrder = async (userId: string, orderId: string): Promise<boolean> => {
  try {
    // Check if order belongs to user
    const { data: order, error: checkError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();
    
    if (checkError || !order) {
      console.error('Error checking order or not found:', checkError);
      return false;
    }
    
    // Check if order can be cancelled (only pending orders)
    if (order.status !== 'pending') {
      toast.error('Only pending orders can be cancelled');
      return false;
    }
    
    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
        payment_status: 'cancelled'
      })
      .eq('id', orderId)
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error cancelling order:', updateError);
      return false;
    }
    
    // Create notification
    const { error: notificationError } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        title: 'Order Cancelled',
        message: `Your order #${orderId.slice(0, 8)} has been cancelled.`,
        type: 'order',
        link: `/orders/${orderId}`,
        read: false
      });
    
    if (notificationError) {
      console.error('Error creating cancellation notification:', notificationError);
      // Non-critical, continue
    }
    
    // Create notification for shop admin
    if (order.shop_id) {
      // Get shop admins
      const { data: shopAdmins, error: adminsError } = await supabase
        .from('shop_admins')
        .select('user_id')
        .eq('shop_id', order.shop_id);
      
      if (!adminsError && shopAdmins?.length) {
        // Create notification for each shop admin
        for (const admin of shopAdmins) {
          await supabase
            .from('user_notifications')
            .insert({
              user_id: admin.user_id,
              title: 'Order Cancelled',
              message: `Order #${orderId.slice(0, 8)} has been cancelled by the customer.`,
              type: 'order',
              link: `/admin/dashboard`,
              read: false
            });
        }
      }
    }
    
    toast.success('Order cancelled successfully');
    return true;
  } catch (error) {
    console.error('Error cancelling order:', error);
    toast.error('Failed to cancel order. Please try again.');
    return false;
  }
};
