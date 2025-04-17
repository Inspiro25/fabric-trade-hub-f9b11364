import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Order } from '@/types/order';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  createOrder: (orderData: Partial<Order>) => Promise<string | null>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchOrders = async () => {
    if (!currentUser) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the Order type
      const transformedOrders = data.map(order => ({
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total_amount: order.total,
        items: order.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        })),
        created_at: order.created_at,
        payment_status: order.payment_status,
        shipping_address: order.shipping_address,
        user_id: order.user_id
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>): Promise<string | null> => {
    if (!currentUser) {
      toast.error('Please login to place an order');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          user_id: currentUser.uid,
          order_number: `ORD-${Date.now()}`,
          status: 'pending',
          created_at: new Date().toISOString(),
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the new order to the state
      setOrders(prev => [{
        id: data.id,
        order_number: data.order_number,
        status: data.status,
        total_amount: data.total,
        items: data.items || [],
        created_at: data.created_at,
        payment_status: data.payment_status,
        shipping_address: data.shipping_address,
        user_id: data.user_id
      }, ...prev]);

      toast.success('Order placed successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return null;
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    if (!currentUser) return null;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .eq('user_id', currentUser.uid)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        order_number: data.order_number,
        status: data.status,
        total_amount: data.total,
        items: data.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        })),
        created_at: data.created_at,
        payment_status: data.payment_status,
        shipping_address: data.shipping_address,
        user_id: data.user_id
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  // Fetch orders when user changes
  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const value = {
    orders,
    isLoading,
    createOrder,
    getOrderById,
    refreshOrders: fetchOrders
  };

  return (
    <OrderContext.Provider value={value}>
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