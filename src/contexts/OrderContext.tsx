
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { ExtendedUser } from '@/types/auth';

export interface OrderItem {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  paymentStatus: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | undefined;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<string | undefined>;
  cancelOrder: (id: string) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchOrders = useCallback(async () => {
    try {
      if (!currentUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const user = currentUser as ExtendedUser;
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.uid || user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data to match our Order type
      const transformedOrders: Order[] = (data || []).map((item: any) => ({
        id: item.id,
        orderNumber: item.order_number || '',
        userId: item.user_id,
        status: item.status,
        total: item.total_amount || 0,
        items: item.items || [],
        createdAt: item.created_at,
        paymentStatus: item.payment_status || '',
        shippingAddress: item.shipping_address || '',
        paymentMethod: item.payment_method || '',
        trackingNumber: item.tracking_number,
        notes: item.notes
      }));

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const user = currentUser as ExtendedUser;
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.uid || user.id,
          order_number: orderData.orderNumber,
          status: orderData.status,
          total_amount: orderData.total,
          items: orderData.items,
          payment_status: orderData.paymentStatus,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          tracking_number: orderData.trackingNumber,
          notes: orderData.notes
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add the new order to the state
      if (data) {
        const newOrder: Order = {
          id: data.id,
          orderNumber: data.order_number || '',
          userId: data.user_id,
          status: data.status,
          total: data.total_amount || 0,
          items: data.items || [],
          createdAt: data.created_at,
          paymentStatus: data.payment_status || '',
          shippingAddress: data.shipping_address || '',
          paymentMethod: data.payment_method || '',
          trackingNumber: data.tracking_number,
          notes: data.notes
        };

        setOrders(prev => [newOrder, ...prev]);
        return data.id;
      }
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }, [currentUser]);

  const cancelOrder = useCallback(async (id: string) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const user = currentUser as ExtendedUser;
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('user_id', user.uid || user.id);

      if (updateError) throw updateError;

      // Update the order in state
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, status: 'cancelled' } : order
        )
      );

      toast.success('Order cancelled successfully');
      return true;
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('Failed to cancel order');
      return false;
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        getOrderById,
        createOrder,
        cancelOrder,
        fetchOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
