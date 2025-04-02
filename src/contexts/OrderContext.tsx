import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any[];
  created_at: string;
  payment_status: string;
  shipping_address: any;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchOrders = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    if (!currentUser) {
      toast.error('Please login to place an order');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          user_id: currentUser.uid,
          order_number: `ORD-${Date.now()}`,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => [data, ...prev]);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      createOrder,
      fetchOrders,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};