
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
  const navigate = useNavigate();
  
  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-lg font-semibold">My Orders</h1>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="px-3 py-2 bg-white border-b border-gray-100">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search orders" className="pl-8 h-9 text-sm" />
          </div>
          <Button variant="outline" size="sm" className="border-gray-200">
            <Filter size={14} className="mr-1" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-3 pt-2 bg-white">
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs">Processing</TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs">Shipped</TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">Delivered</TabsTrigger>
          </TabsList>
          
          {/* Order List - Moved TabsContent inside the Tabs component */}
          <div className="p-3">
            <TabsContent value="all" className="mt-0">
              {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabsContent>
            
            <TabsContent value="processing" className="mt-0">
              {orders.filter(o => o.status === 'Processing').map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabsContent>
            
            <TabsContent value="shipped" className="mt-0">
              {orders.filter(o => o.status === 'Shipped').map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabsContent>
            
            <TabsContent value="delivered" className="mt-0">
              {orders.filter(o => o.status === 'Delivered').map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
