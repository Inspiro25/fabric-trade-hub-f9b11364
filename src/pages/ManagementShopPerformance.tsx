import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart,
  Clock,
  Filter,
  RefreshCw,
  Calendar,
  Package,
  Star,
  Store,
  Download
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

interface ShopSales {
  amount: number;
  created_at: string;
}

interface ShopProduct {
  id: string;
  name: string;
  sales_count: number;
}

interface CategorySales {
  category: string;
  total_sales: number;
}

interface ShopPerformance {
  id: string;
  name: string;
  sales: number;
  orders: number;
  profit: number;
  rating: number;
  reviewCount: number;
  followerCount: number;
  productCount: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
  }>;
  dailySales: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

const ManagementShopPerformance = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const [timeFilter, setTimeFilter] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<ShopPerformance[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const fetchShopPerformance = async () => {
    setIsLoading(true);
    try {
      // Fetch shops with basic info
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('id, name, rating, review_count, follower_count, product_count');

      if (shopsError) throw shopsError;

      // Fetch sales data for each shop
      const shopPerformanceData = await Promise.all(
        shopsData.map(async (shop) => {
          // Get sales data
          const { data: salesData, error: salesError } = await supabase
            .from('shop_sales')
            .select('*')
            .eq('shop_id', shop.id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          if (salesError) throw salesError;

          // Calculate metrics
          const totalSales = (salesData as ShopSales[]).reduce((sum, sale) => sum + sale.amount, 0);
          const totalOrders = (salesData as ShopSales[]).length;
          const profit = totalSales * 0.3; // Assuming 30% profit margin
          const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
          const conversionRate = (totalOrders / (shop.follower_count || 1)) * 100;

          // Get top products
          const { data: topProducts, error: productsError } = await supabase
            .from('products')
            .select('id, name, sales_count')
            .eq('shop_id', shop.id)
            .order('sales_count', { ascending: false })
            .limit(5);

          if (productsError) throw productsError;

          // Get sales by category
          const { data: categorySales, error: categoryError } = await supabase
            .from('product_categories')
            .select('category, total_sales')
            .eq('shop_id', shop.id);

          if (categoryError) throw categoryError;

          // Get daily sales data
          const dailySales = (salesData as ShopSales[]).reduce((acc, sale) => {
            const date = new Date(sale.created_at).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = { sales: 0, orders: 0 };
            }
            acc[date].sales += sale.amount;
            acc[date].orders += 1;
            return acc;
          }, {} as Record<string, { sales: number; orders: number }>);
    
    return {
            id: shop.id,
            name: shop.name,
            sales: totalSales,
            orders: totalOrders,
            profit,
            rating: shop.rating || 0,
            reviewCount: shop.review_count || 0,
            followerCount: shop.follower_count || 0,
            productCount: shop.product_count || 0,
            monthlyGrowth: ((totalSales - (totalSales * 0.8)) / (totalSales * 0.8)) * 100, // Example growth calculation
      conversionRate,
            averageOrderValue,
            topProducts: (topProducts as ShopProduct[]).map(p => ({
              id: p.id,
              name: p.name,
              sales: p.sales_count || 0
            })),
            salesByCategory: (categorySales as CategorySales[]).map(c => ({
              category: c.category,
              sales: c.total_sales || 0
            })),
            dailySales: Object.entries(dailySales).map(([date, data]) => ({
              date,
              sales: data.sales,
              orders: data.orders
            }))
          };
        })
      );

      setShops(shopPerformanceData);
      if (shopPerformanceData.length > 0 && !selectedShop) {
        setSelectedShop(shopPerformanceData[0].id);
      }
    } catch (error) {
      console.error('Error fetching shop performance:', error);
      toast.error('Failed to load shop performance data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShopPerformance();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchShopPerformance();
    setIsRefreshing(false);
    toast.success('Data refreshed successfully');
  };

  const selectedShopData = shops.find(shop => shop.id === selectedShop);

  return (
    <>
      <Helmet>
        <title>Shop Performance | Management Portal</title>
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/management/dashboard')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl md:text-3xl font-bold tracking-tight">Shop Performance</h2>
              <p className="text-sm text-muted-foreground">
                Monitor and analyze shop performance metrics
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center sm:justify-end">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[150px]" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Shop Selector */}
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2 overflow-x-auto">
                {shops.map((shop) => (
                  <Button
                    key={shop.id}
                    variant={selectedShop === shop.id ? "default" : "outline"}
                    className="flex items-center gap-2 whitespace-nowrap min-w-[120px] sm:min-w-0"
                    onClick={() => setSelectedShop(shop.id)}
                  >
                    <Store className="h-4 w-4" />
                    <span>{isMobile ? shop.name.substring(0, 10) : shop.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {shop.orders}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {selectedShopData && (
              <>
                {/* Key Metrics */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold">
                        ₹{selectedShopData.sales.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        <span className="text-green-500">+{selectedShopData.monthlyGrowth.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedShopData.orders.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        <span>Avg. ₹{selectedShopData.averageOrderValue.toFixed(2)} per order</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedShopData.conversionRate.toFixed(1)}%
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{selectedShopData.followerCount} followers</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{selectedShopData.profit.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <BarChart className="h-3 w-3 mr-1" />
                        <span>30% margin</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Charts */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedShopData.dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: isMobile ? 10 : 12 }}
                              interval={isMobile ? 2 : 0}
                            />
                            <YAxis 
                              yAxisId="left"
                              tick={{ fontSize: isMobile ? 10 : 12 }}
                              width={isMobile ? 40 : 60}
                            />
                            <YAxis 
                              yAxisId="right" 
                              orientation="right"
                              tick={{ fontSize: isMobile ? 10 : 12 }}
                              width={isMobile ? 40 : 60}
                            />
                            <Tooltip />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="sales"
                              stroke="#8884d8"
                              name="Sales (₹)"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="orders"
                              stroke="#82ca9d"
                              name="Orders"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Sales by Category</CardTitle>
                      <CardDescription>Revenue distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                              data={selectedShopData.salesByCategory}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                                  fill="#8884d8"
                              dataKey="sales"
                                >
                              {selectedShopData.salesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedShopData.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm font-medium">{index + 1}.</span>
                            <span className="text-sm truncate">{product.name}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium whitespace-nowrap">
                              ₹{product.sales.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ManagementShopPerformance;
