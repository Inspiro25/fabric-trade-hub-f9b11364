import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getShopById } from '@/lib/supabase/shops';
import { getShopProducts } from '@/lib/supabase/products'; // Changed from fetchShopProducts
import { Shop } from '@/lib/shops/types';
import { Product } from '@/lib/products/types';
import { getShopOrders } from '@/lib/orders';
import { Order } from '@/lib/orders/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { LineChart, BarChart, PieChart } from '@/components/charts';

const AdminDashboard = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadShopData = async () => {
      if (!shopId) {
        // Try to get shopId from session storage (for admin login)
        const storedShopId = sessionStorage.getItem('adminShopId');
        if (storedShopId) {
          navigate(`/admin/dashboard/${storedShopId}`);
          return;
        } else {
          toast.error('No shop selected');
          navigate('/admin/login');
          return;
        }
      }

      setIsLoading(true);
      try {
        // Load shop details
        const shopData = await getShopById(shopId);
        if (!shopData) {
          toast.error('Shop not found');
          navigate('/admin/login');
          return;
        }
        setShop(shopData);

        // Load products
        const productsData = await getShopProducts(shopId);
        setProducts(productsData);

        // Load orders
        const ordersData = await getShopOrders(shopId);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading shop data:', error);
        toast.error('Failed to load shop data');
      } finally {
        setIsLoading(false);
      }
    };

    loadShopData();
  }, [shopId, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminShopId');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <Button onClick={() => navigate('/admin/login')}>Go to Login</Button>
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 10).length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{shop.name} Dashboard</h1>
          <p className="text-muted-foreground">Manage your shop, products, and orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Needs your attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">{lowStockProducts} low in stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Shop Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shop.rating.toFixed(1)}/5.0</div>
                <p className="text-xs text-muted-foreground mt-1">From {shop.review_count} reviews</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Over Time</CardTitle>
                <CardDescription>Your shop's revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={[]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={[]} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your shop's most recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Order ID</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-left py-2 font-medium">Status</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-2">{order.id.substring(0, 8)}</td>
                          <td className="py-2">{order.customer_name}</td>
                          <td className="py-2">{formatDate(order.created_at)}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2 text-right">{formatCurrency(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab('orders')}>
                View All Orders
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your shop's products</CardDescription>
              </div>
              <Button onClick={() => navigate(`/admin/products/${shopId}`)}>
                Manage Products
              </Button>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any products yet</p>
                  <Button onClick={() => navigate(`/admin/products/${shopId}/new`)}>
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Product</th>
                        <th className="text-left py-2 font-medium">Price</th>
                        <th className="text-left py-2 font-medium">Stock</th>
                        <th className="text-right py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3">
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <span className="truncate max-w-[200px]">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-2">{formatCurrency(product.price)}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.stock > 20 ? 'bg-green-100 text-green-800' :
                              product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/products/${shopId}/edit/${product.id}`)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/products/${shopId}`)}>
                View All Products
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage your shop's orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Order ID</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-left py-2 font-medium">Status</th>
                        <th className="text-left py-2 font-medium">Payment</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                        <th className="text-right py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-2">{order.id.substring(0, 8)}</td>
                          <td className="py-2">{order.customer_name}</td>
                          <td className="py-2">{formatDate(order.created_at)}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="py-2 text-right">{formatCurrency(order.total)}</td>
                          <td className="py-2 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/orders/${shopId}/${order.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shop Settings</CardTitle>
              <CardDescription>Manage your shop's details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate(`/admin/settings/${shopId}`)}>
                Edit Shop Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
