import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/order';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { getOrders, cancelOrder, initiateReturn } from '@/services/orderService';

const statusIcons = {
  pending: <Package className="h-4 w-4" />,
  processing: <RefreshCw className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  returned: <RefreshCw className="h-4 w-4" />
};

const statusColors = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
  returned: "bg-gray-500"
};

const OrderCard: React.FC<{ order: Order; onAction: () => void }> = ({ order, onAction }) => {
  const { isDarkMode } = useTheme();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleTrackOrder = (trackingId: string) => {
    window.open(`/track-order/${trackingId}`, '_blank');
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!currentUser?.uid) return;
    try {
      await cancelOrder(orderId, currentUser.uid);
      onAction();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    if (!currentUser?.uid) return;
    try {
      await initiateReturn(orderId, "Customer initiated return", currentUser.uid);
      onAction();
    } catch (error) {
      console.error('Error initiating return:', error);
    }
  };

  return (
    <Card className={cn(
      "mb-4",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
    )}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn(
              "text-sm font-medium",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              Order #{order.id.slice(0, 8)}
            </p>
            <p className={cn(
              "text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {format(new Date(order.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              "flex items-center gap-1",
              statusColors[order.status]
            )}
          >
            {statusIcons[order.status]}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "font-medium",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                ₹{order.total.toFixed(2)}
              </p>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            >
              {isDetailsOpen ? 'Hide Details' : 'View Details'}
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isDetailsOpen && "rotate-90"
              )} />
            </Button>
          </div>

          {isDetailsOpen && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        {item.product.name}
                      </p>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                      {(item.color || item.size) && (
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>
                          {item.color && `Color: ${item.color}`}
                          {item.color && item.size && ' | '}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      )}
                    </div>
                    <p className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      ₹{item.total}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className={cn(
                  "text-sm font-medium mb-2",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Shipping Address
                </h4>
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                  {order.shippingAddress.pincode}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {order.status === 'shipped' && order.tracking_id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTrackOrder(order.tracking_id!)}
                    className="flex-1"
                  >
                    Track Order
                    <Truck className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {order.status === 'pending' && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex-1"
                  >
                    Cancel Order
                    <XCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
                
                {order.status === 'delivered' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReturnOrder(order.id)}
                    className="flex-1"
                  >
                    Return Order
                    <RefreshCw className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MyOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | '30days' | '6months' | '1year'>('all');
  const queryClient = useQueryClient();

  // Fetch orders with React Query
  const { data: orders, isLoading, isError, refetch } = useQuery<Order[]>({
    queryKey: ['orders', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      return getOrders(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Filter orders based on active tab, search query, and date range
  const filteredOrders = React.useMemo(() => {
    return orders?.filter(order => {
      const matchesTab = activeTab === 'all' || order.status === activeTab;
      const matchesSearch = searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      if (dateRange === 'all') return matchesTab && matchesSearch;
      
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const diffInDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
      
      const matchesDate = 
        (dateRange === '30days' && diffInDays <= 30) ||
        (dateRange === '6months' && diffInDays <= 180) ||
        (dateRange === '1year' && diffInDays <= 365);
      
      return matchesTab && matchesSearch && matchesDate;
    }) || [];
  }, [orders, activeTab, searchQuery, dateRange]);

  // Pull to refresh functionality for mobile
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isError) {
    return (
      <div className="p-4 text-center">
        <p className={cn(
          "text-lg font-medium mb-2",
          isDarkMode ? "text-gray-300" : "text-gray-700"
        )}>
          Failed to load orders
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-24",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className={cn(
          "fixed top-0 left-0 right-0 h-1 bg-kutuku-primary",
          isDarkMode && "bg-blue-600"
        )}>
          <div className="h-full w-1/3 animate-[progress_1s_ease-in-out_infinite] bg-white/20" />
        </div>
      )}

      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 p-4 border-b",
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      )}>
        <h1 className={cn(
          "text-lg font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          My Orders
        </h1>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9",
                isDarkMode && "bg-gray-800 border-gray-700"
              )}
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Orders</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <label className={cn(
                      "text-sm font-medium block mb-2",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}>
                      Time Period
                    </label>
                    <Select
                      value={dateRange}
                      onValueChange={(value: any) => setDateRange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ScrollArea className="w-full">
          <Tabs 
            value={activeTab} 
            onValueChange={(value: any) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="inline-flex w-full justify-start p-0 bg-transparent">
              <TabsTrigger 
                value="all"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="processing"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                Processing
              </TabsTrigger>
              <TabsTrigger 
                value="shipped"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                Shipped
              </TabsTrigger>
              <TabsTrigger 
                value="delivered"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                Delivered
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled"
                className={cn(
                  "rounded-full",
                  isDarkMode && "data-[state=active]:bg-gray-800"
                )}
              >
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollArea>
      </div>

      {/* Orders List with loading states */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className={cn(
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <CardHeader className="p-4">
                  <div className="flex justify-between">
                    <Skeleton className={cn(
                      "h-4 w-24",
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    )} />
                    <Skeleton className={cn(
                      "h-4 w-20",
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    )} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className={cn(
                    "h-4 w-32 mb-2",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )} />
                  <Skeleton className={cn(
                    "h-4 w-24",
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  )} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className={cn(
              "h-12 w-12 mx-auto mb-4",
              isDarkMode ? "text-gray-600" : "text-gray-400"
            )} />
            <p className={cn(
              "text-lg font-medium mb-2",
              isDarkMode ? "text-gray-300" : "text-gray-700"
            )}>
              {searchQuery 
                ? "No orders found matching your search"
                : "No orders found"}
            </p>
            <p className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {searchQuery 
                ? "Try adjusting your search or filters"
                : "Start shopping to see your orders here"}
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div 
            className="space-y-4"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (touch.clientY < 100) {
                handleRefresh();
              }
            }}
          >
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onAction={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders; 