
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart,
  Clock,
  Filter
} from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManagementShopPerformance = () => {
  const navigate = useNavigate();
  const { analytics, isLoading } = useDashboardAnalytics();
  const [timeFilter, setTimeFilter] = useState('month');
  const [shopFilter, setShopFilter] = useState('all');

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  // Additional shop metrics
  const getShopMetrics = (shop) => {
    const avgOrderValue = shop.sales / (shop.orders || 1);
    const conversionRate = Math.round((shop.orders / 1200) * 100);
    const profitMargin = Math.round((shop.profit / shop.sales) * 100);
    const customerRetention = Math.floor(Math.random() * 30) + 60; // Placeholder: 60-90%
    const salesTrend = Math.random() > 0.7 ? -1 : 1; // Random up/down trend
    const salesGrowth = salesTrend * (Math.floor(Math.random() * 15) + 2); // Random growth rate 2-17%
    
    return {
      avgOrderValue,
      conversionRate,
      profitMargin,
      customerRetention,
      salesGrowth
    };
  };

  // Generate sample data for category distribution
  const generateCategoryData = (shop) => {
    return [
      { name: 'Electronics', value: Math.floor(Math.random() * 40) + 10 },
      { name: 'Clothing', value: Math.floor(Math.random() * 30) + 5 },
      { name: 'Home', value: Math.floor(Math.random() * 20) + 5 },
      { name: 'Beauty', value: Math.floor(Math.random() * 15) + 5 },
      { name: 'Other', value: Math.floor(Math.random() * 10) + 5 },
    ];
  };

  // Generate monthly sales data
  const generateMonthlySales = (shop) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * shop.sales * 0.3) + shop.sales * 0.1,
      orders: Math.floor(Math.random() * shop.orders * 0.3) + shop.orders * 0.1,
    }));
  };

  const getMetricColor = (value, isGrowth = false) => {
    if (isGrowth) {
      return value >= 0 ? 'text-green-500' : 'text-red-500';
    }
    return value > 50 ? 'text-green-500' : value > 30 ? 'text-amber-500' : 'text-red-500';
  };

  return (
    <div className="flex-1 space-y-4 p-2 md:p-8 pt-4 md:pt-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/management/dashboard')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">Shop Performance</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Filter className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="h-8 md:h-9 w-[100px] md:w-[120px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs md:text-sm text-muted-foreground">
            <Clock className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading shop performance data...</p>
        </div>
      ) : !analytics?.shopPerformance?.length ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">No shop performance data available</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/management/shops')}>
            Manage Shops
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Performance Summary */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-1 px-3 md:px-6">
                <CardTitle className="text-xs md:text-sm">Total Sales</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 md:px-6">
                <div className="text-lg md:text-2xl font-bold">
                  ${analytics.shopPerformance.reduce((sum, shop) => sum + shop.sales, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+8.2%</span> from last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 px-3 md:px-6">
                <CardTitle className="text-xs md:text-sm">Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 md:px-6">
                <div className="text-lg md:text-2xl font-bold">
                  {analytics.shopPerformance.reduce((sum, shop) => sum + shop.orders, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+5.4%</span> from last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 px-3 md:px-6">
                <CardTitle className="text-xs md:text-sm">Total Profit</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 md:px-6">
                <div className="text-lg md:text-2xl font-bold">
                  ${analytics.shopPerformance.reduce((sum, shop) => sum + shop.profit, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+10.1%</span> from last period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 px-3 md:px-6">
                <CardTitle className="text-xs md:text-sm">Avg. Conversion</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-3 md:px-6">
                <div className="text-lg md:text-2xl font-bold">
                  {Math.round(analytics.shopPerformance.reduce((sum, shop) => sum + (shop.orders / 1200) * 100, 0) / analytics.shopPerformance.length)}%
                </div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">-1.2%</span> from last period
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Individual Shop Performance Cards */}
          <div className="grid gap-4 grid-cols-1">
            {analytics.shopPerformance.map((shop) => {
              const metrics = getShopMetrics(shop);
              const categoryData = generateCategoryData(shop);
              const monthlySales = generateMonthlySales(shop);
              
              return (
                <Card key={shop.name} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <CardTitle>{shop.name}</CardTitle>
                      <div className={`text-sm font-medium ${metrics.salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                        {metrics.salesGrowth >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {metrics.salesGrowth >= 0 ? '+' : ''}{metrics.salesGrowth}% growth
                      </div>
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                        <DollarSign className="h-3 w-3" />
                        Revenue: ${shop.sales.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                        <ShoppingCart className="h-3 w-3" />
                        Orders: {shop.orders}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                        <BarChart className="h-3 w-3" />
                        Profit Margin: {metrics.profitMargin}%
                      </span>
                    </CardDescription>
                  </CardHeader>
                  
                  <Tabs defaultValue="overview" className="w-full">
                    <div className="px-4 md:px-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sales">Sales</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="overview" className="p-4 md:p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                          <p className="text-base md:text-xl font-semibold">${metrics.avgOrderValue.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Conversion Rate</p>
                          <p className="text-base md:text-xl font-semibold">{metrics.conversionRate}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Profit Margin</p>
                          <p className="text-base md:text-xl font-semibold">{metrics.profitMargin}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Customer Retention</p>
                          <p className="text-base md:text-xl font-semibold">{metrics.customerRetention}%</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sales" className="p-2 pt-0">
                      <div className="h-60 md:h-72 mt-2 w-full overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={monthlySales}
                            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} width={30} />
                            <Tooltip contentStyle={{ fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="sales" name="Sales ($)" fill="#8884d8" />
                            <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="categories" className="p-2 pt-0">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 h-60 md:h-72 mt-2">
                        <div className="w-full md:w-1/2 h-40 md:h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 px-3 md:px-0">
                          <h4 className="text-xs md:text-sm font-medium mb-2">Category Performance</h4>
                          {categoryData.map((category, index) => (
                            <div key={category.name} className="mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs truncate max-w-[100px]">{category.name}</span>
                                <span className="text-xs font-medium">{category.value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full" 
                                  style={{ 
                                    width: `${category.value}%`, 
                                    backgroundColor: COLORS[index % COLORS.length] 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <CardFooter className="flex justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/management/shops`)}>
                      Manage Shop
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementShopPerformance;
