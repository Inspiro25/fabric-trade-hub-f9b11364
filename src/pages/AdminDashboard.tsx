import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getShopById } from '@/lib/shops';
import { fetchShopProducts } from '@/lib/shops/products';
import { fetchShopOrders } from '@/lib/orders';
import { Shop } from '@/lib/shops/types';
import { Product } from '@/lib/products/types';
import { Order } from '@/lib/orders/types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { BarChart, LineChart } from '@/components/charts';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for charts
  const salesData = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 900 },
    { name: 'Mar', total: 1600 },
    { name: 'Apr', total: 1800 },
    { name: 'May', total: 2200 },
    { name: 'Jun', total: 2600 },
    { name: 'Jul', total: 2400 },
  ];
  
  const productPerformance = [
    { name: 'Product A', value: 35 },
    { name: 'Product B', value: 25 },
    { name: 'Product C', value: 20 },
    { name: 'Product D', value: 15 },
    { name: 'Others', value: 5 },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        if (!currentUser) {
          navigate('/admin/login');
          return;
        }
        
        // In a real app, you would get the shop ID from the user's profile
        // For now, we'll use a mock shop ID
        const shopId = 'shop-1';
        
        // Fetch shop data
        const shopData = await getShopById(shopId);
        if (!shopData) {
          toast({
            title: "Shop not found",
            description: "Unable to load shop data",
            variant: "destructive",
          });
          return;
        }
        
        setShop(shopData);
        
        // Fetch products
        const productsData = await fetchShopProducts(shopId);
        setProducts(productsData);
        
        // Fetch orders
        const ordersData = await fetchShopOrders(shopId);
        setOrders(ordersData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [currentUser, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <p className="mb-4">Unable to load shop data. Please try again later.</p>
        <Button onClick={() => navigate('/admin/login')}>
          Return to Login
        </Button>
      </div>
    );
  }

  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const lowStockProducts = products.filter(product => product.stock < 10).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "")}>
            Dashboard
          </h1>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Welcome back to your shop dashboard
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={() => navigate('/admin/products')}>
            Manage Products
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/settings')}>
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium dark:text-white">Shop Status</h3>
            <Badge variant={shop.is_verified ? "success" : "warning"}>
              {shop.is_verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src={shop.logo || '/placeholder-logo.svg'} 
                alt={shop.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">{shop.name}</h2>
              <p className="text-sm dark:text-gray-300">{shop.owner_name}</p>
              <p className="text-xs dark:text-gray-400">Since {formatDate(shop.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Performance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm dark:text-gray-300">Rating</p>
              <div className="flex items-center">
                <span className="text-xl font-bold dark:text-white">{shop.rating.toFixed(1)}</span>
                <span className="text-xs ml-1 dark:text-gray-400">/ 5.0</span>
              </div>
            </div>
            <div>
              <p className="text-sm dark:text-gray-300">Reviews</p>
              <p className="text-xl font-bold dark:text-white">{shop.review_count}</p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-300">Followers</p>
              <p className="text-xl font-bold dark:text-white">{shop.followers_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Inventory</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm dark:text-gray-300">Products</p>
              <p className="text-xl font-bold dark:text-white">{products.length}</p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-300">Categories</p>
              <p className="text-xl font-bold dark:text-white">
                {new Set(products.map(p => p.category_id)).size}
              </p>
            </div>
            <div>
              <p className="text-sm dark:text-gray-300">Low Stock</p>
              <p className="text-xl font-bold text-amber-500">{lowStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Total Revenue
                </p>
                <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "")}>
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Total Orders
                </p>
                <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "")}>
                  {totalOrders}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Pending Orders
                </p>
                <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "")}>
                  {pendingOrders}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Low Stock Items
                </p>
                <p className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "")}>
                  {lowStockProducts}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className={cn(isDarkMode ? "bg-gray-700" : "")}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
              <CardHeader>
                <CardTitle className={cn(isDarkMode ? "text-white" : "")}>
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={salesData} 
                  xField="name" 
                  yField="total" 
                  height={300}
                  isDarkMode={isDarkMode}
                />
              </CardContent>
            </Card>
            
            <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
              <CardHeader>
                <CardTitle className={cn(isDarkMode ? "text-white" : "")}>
                  Product Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={productPerformance} 
                  xField="name" 
                  yField="value" 
                  height={300}
                  isDarkMode={isDarkMode}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className={cn(isDarkMode ? "text-white" : "")}>
                Recent Products
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/products')}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map(product => (
                  <div 
                    key={product.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded overflow-hidden">
                        <img 
                          src={product.images[0] || '/placeholder.svg'} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className={cn("font-medium", isDarkMode ? "text-white" : "")}>
                          {product.name}
                        </p>
                        <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          Stock: {product.stock} · {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={product.stock < 10 ? "destructive" : "outline"}>
                      {product.stock < 10 ? "Low Stock" : "In Stock"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card className={cn(isDarkMode ? "bg-gray-800 border-gray-700" : "")}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className={cn(isDarkMode ? "text-white" : "")}>
                Recent Orders
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map(order => (
                  <div 
                    key={order.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    )}
                  >
                    <div>
                      <p className={cn("font-medium", isDarkMode ? "text-white" : "")}>
                        Order #{order.id.slice(-6)}
                      </p>
                      <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {formatDate(order.created_at)} · {order.items.length} items
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={cn("font-medium", isDarkMode ? "text-white" : "")}>
                        {formatCurrency(order.total_amount)}
                      </p>
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'success' : 
                          order.status === 'pending' ? 'warning' : 'default'
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
