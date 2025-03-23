
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  productName?: string;
  productImage?: string;
}

interface OrderDetails {
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

interface OrderDetailsViewProps {
  orderId: string;
  shopId: string;
  onOrderUpdated: () => void;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ 
  orderId, 
  shopId, 
  onOrderUpdated 
}) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState<Partial<OrderDetails>>({});
  
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch order data
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('shop_id', shopId)
        .single();
      
      if (orderError) throw orderError;
      
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;
      
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
      
      const orderDetails: OrderDetails = {
        ...orderData,
        items: itemsWithProducts
      };
      
      setOrder(orderDetails);
      setUpdatedOrder({
        status: orderDetails.status,
        payment_status: orderDetails.payment_status,
        tracking_number: orderDetails.tracking_number,
        notes: orderDetails.notes
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setUpdatedOrder(prev => ({ ...prev, [field]: value }));
  };
  
  const saveOrderChanges = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update(updatedOrder)
        .eq('id', orderId)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      toast.success('Order updated successfully');
      fetchOrderDetails();
      onOrderUpdated();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id.substring(0, 8)}</h3>
          <p className="text-sm text-muted-foreground">
            Created on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-md">
            Total: ${order.total.toFixed(2)}
          </Badge>
          <Badge 
            variant={order.status === 'completed' ? 'success' : 
                  order.status === 'processing' ? 'secondary' : 
                  order.status === 'cancelled' ? 'destructive' : 'warning'}
          >
            {order.status}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="items">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="items">Order Items</TabsTrigger>
          <TabsTrigger value="customer">Customer Details</TabsTrigger>
          <TabsTrigger value="manage">Manage Order</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.productImage && (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <div className="text-xs text-muted-foreground">
                          {item.color && `Color: ${item.color}`} 
                          {item.color && item.size && ' | '}
                          {item.size && `Size: ${item.size}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="font-medium mt-1">{order.customer_name || 'N/A'}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="font-medium mt-1">{order.customer_email || 'N/A'}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="font-medium mt-1">{order.customer_phone || 'N/A'}</div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <div className="font-medium mt-1">{order.payment_method || 'N/A'}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Shipping Address</Label>
                <div className="font-medium mt-1 whitespace-pre-line">
                  {order.shipping_address || 'N/A'}
                </div>
              </div>
              
              <div>
                <Label>Shipping Method</Label>
                <div className="font-medium mt-1">
                  {order.shipping_method || 'Standard Shipping'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Update Order Status</CardTitle>
              <CardDescription>
                Change order status, payment status, and other details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    value={updatedOrder.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select
                    value={updatedOrder.payment_status}
                    onValueChange={(value) => handleInputChange('payment_status', value)}
                  >
                    <SelectTrigger id="payment_status">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    id="tracking_number"
                    value={updatedOrder.tracking_number || ''}
                    onChange={(e) => handleInputChange('tracking_number', e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Input
                  id="notes"
                  value={updatedOrder.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add notes about this order"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={saveOrderChanges} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailsView;
