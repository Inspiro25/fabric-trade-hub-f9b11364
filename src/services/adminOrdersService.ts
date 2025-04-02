import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { 
  AdminOrderSummary,
  AdminOrderDetails, 
  OrderItem, 
  Json, 
  itemsToJsonArray 
} from '@/types/json';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface AdminOrderDetails {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  total: number;
  payment_method?: string;
  payment_status?: string;
  tracking_number?: string;
  notes?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_method?: string;
  items?: OrderItem[];
  shop_id?: string;
  user_id?: string;
}

const itemsToJsonArray = (items: OrderItem[]): Json[] => {
  return items.map(item => ({
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    color: item.color,
    size: item.size
  }));
};

export const getShopOrders = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shop orders:', error);
    return [];
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError) throw orderError;
    
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsError) throw itemsError;
    
    return {
      ...order,
      items: items || []
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

export const updateOrderDetails = async (orderId: string, orderData: Partial<AdminOrderDetails>) => {
  try {
    const updateData = {
      status: orderData.status,
      payment_status: orderData.payment_status,
      tracking_number: orderData.tracking_number,
      notes: orderData.notes,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      shipping_method: orderData.shipping_method,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order details:', error);
    return false;
  }
};

export const fetchShopOrders = async (shopId: string): Promise<AdminOrderSummary[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop orders:', error);
      toast.error('Failed to load orders');
      return [];
    }
    
    return data as AdminOrderSummary[];
  } catch (error) {
    console.error('Error in fetchShopOrders:', error);
    toast.error('An error occurred while fetching orders');
    return [];
  }
};

export const fetchOrderDetails = async (orderId: string, shopId: string): Promise<AdminOrderDetails | null> => {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('shop_id', shopId)
      .single();
    
    if (orderError) {
      console.error('Error fetching order details:', orderError);
      toast.error('Failed to load order details');
      return null;
    }
    
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      toast.error('Failed to load order items');
      return null;
    }
    
    const itemsWithProducts = await Promise.all(itemsData.map(async (item) => {
      const { data: product } = await supabase
        .from('products')
        .select('name, images')
        .eq('id', item.product_id)
        .single();
      
      return {
        ...item,
        productName: product?.name || 'Product',
        productImage: product?.images?.[0] || ''
      };
    }));
    
    return {
      ...orderData,
      items: itemsWithProducts
    };
  } catch (error) {
    console.error('Error in fetchOrderDetails:', error);
    toast.error('An error occurred while fetching order details');
    return null;
  }
};

export const updateOrder = async (
  orderId: string, 
  shopId: string, 
  updateData: Partial<AdminOrderDetails>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .eq('shop_id', shopId);
    
    if (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      return false;
    }
    
    toast.success('Order updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateOrder:', error);
    toast.error('An error occurred while updating the order');
    return false;
  }
};

export const getShopSalesAnalytics = async (shopId: string) => {
  try {
    const { data, error } = await supabase
      .from('monthly_shop_analytics')
      .select('*')
      .eq('shop_id', shopId)
      .order('month', { ascending: false });
    
    if (error) {
      console.error('Error fetching shop sales analytics:', error);
      toast.error('Failed to load sales analytics');
      return [];
    }
    
    return data.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      order_count: item.order_count,
      total_revenue: item.total_revenue
    }));
  } catch (error) {
    console.error('Error in getShopSalesAnalytics:', error);
    toast.error('An error occurred while fetching sales analytics');
    return [];
  }
};

export const isShopAdmin = async (userId: string, shopId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('shop_admins')
      .select('id')
      .eq('user_id', userId)
      .eq('shop_id', shopId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking shop admin status:', error);
    return false;
  }
};
