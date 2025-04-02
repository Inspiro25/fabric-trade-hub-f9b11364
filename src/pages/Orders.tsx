
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import RequireAuth from '@/components/auth/RequireAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';

// Mock data for orders
const orders = [
  {
    id: 'ORD-1234567',
    date: '2023-08-15',
    total: 149.99,
    status: 'Delivered',
    items: [
      { name: 'Wireless Headphones', qty: 1, price: 89.99 },
      { name: 'Phone Case', qty: 1, price: 19.99 },
      { name: 'USB-C Cable', qty: 2, price: 19.99 }
    ],
    trackingNumber: 'TRK-987654321',
    estimatedDelivery: '2023-08-18'
  },
  {
    id: 'ORD-7654321',
    date: '2023-07-29',
    total: 299.99,
    status: 'Shipped',
    items: [
      { name: 'Smart Watch', qty: 1, price: 249.99 },
      { name: 'Watch Band', qty: 1, price: 29.99 },
      { name: 'Screen Protector', qty: 1, price: 9.99 }
    ],
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2023-08-22'
  },
  {
    id: 'ORD-9876543',
    date: '2023-07-15',
    total: 599.99,
    status: 'Processing',
    items: [
      { name: 'Laptop', qty: 1, price: 599.99 }
    ],
    trackingNumber: '',
    estimatedDelivery: '2023-08-25'
  }
];

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'Delivered':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
    case 'Shipped':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Shipped</Badge>;
    case 'Processing':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Processing</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
  }
};

const OrderItem = ({ order }: { order: typeof orders[0] }) => {
  const navigate = useNavigate();
  
  const handleOrderClick = () => {
    navigate(`/tracking/${order.id}`);
  };
  
  return (
    <Card className="mb-3 border border-gray-100 shadow-sm" onClick={handleOrderClick}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium">{order.id}</h3>
            <p className="text-xs text-gray-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-1">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-gray-700">
                {item.name} {item.qty > 1 ? `x${item.qty}` : ''}
              </span>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-gray-500">
              +{order.items.length - 2} more items
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Package size={14} className="text-blue-600 mr-1" />
            <span className="text-xs text-blue-600 font-medium">Track Order</span>
          </div>
          <div className="text-sm font-semibold">${order.total.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const { orders, loading } = useOrders();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 p-4 border rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order #{order.order_number}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                <p>Total: {formatCurrency(order.total_amount)}</p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Payment Status: {order.payment_status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
