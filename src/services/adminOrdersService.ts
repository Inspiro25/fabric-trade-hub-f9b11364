
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminOrderSummary {
  id: string;
  created_at: string;
  status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  payment_status: string;
}

export interface AdminOrderDetails {
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
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  productName?: string;
  productImage?: string;
}

// Fetch orders for a specific shop
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

// Fetch detailed information for a single order
export const fetchOrderDetails = async (orderId: string, shopId: string): Promise<AdminOrderDetails | null> => {
  try {
    // Fetch order data
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
    
    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      toast.error('Failed to load order items');
      return null;
    }
    
    // Fetch product details for each item
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

// Update order details
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

// Get shop sales analytics
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
    
    // Format the data for display
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

// Check if a user is an admin for a specific shop
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
