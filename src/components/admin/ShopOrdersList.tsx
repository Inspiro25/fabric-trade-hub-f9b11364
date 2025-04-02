
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Eye, Search, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import OrderDetailsView from './OrderDetailsView';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  payment_status: string;
}

interface ShopOrdersListProps {
  shopId: string;
}

const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (shopId) {
      fetchOrders();
    }
  }, [shopId]);
  
  useEffect(() => {
    if (orders.length) {
      let filtered = [...orders];
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(order => 
          order.customer_name?.toLowerCase().includes(query) ||
          order.customer_email?.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
        );
      }
      
      // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter(order => order.status === selectedStatus);
      }
      
      setFilteredOrders(filtered);
    }
  }, [searchQuery, selectedStatus, orders]);
  
  const viewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId);
    setShowOrderDetails(true);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchOrders}
            title="Refresh orders"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableCaption>Shop orders management</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer_name || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.customer_email || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'paid' ? 'success' : 'warning'}>
                      {order.payment_status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewOrderDetails(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and manage order information
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetailsView 
              orderId={selectedOrder} 
              shopId={shopId} 
              onOrderUpdated={fetchOrders}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopOrdersList;
