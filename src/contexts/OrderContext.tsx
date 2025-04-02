
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner'; // Import toast from Sonner

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: any[];
  payment_status?: string;
  shipping_address?: any;
  created_at: string;
  user_id: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchOrders = async () => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', currentUser.id || currentUser.uid)
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        throw fetchError;
      }
      
      setOrders(data as Order[]);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Update local state
      setOrders((prev) => prev.filter(order => order.id !== id));
      toast.success('Order deleted successfully');
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete order');
      toast.error('Failed to delete order');
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [currentUser]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        deleteOrder
      }}
    >
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
