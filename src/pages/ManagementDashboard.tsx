import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  ArrowUpRight, 
  DollarSign, 
  ShoppingCart, 
  Store, 
  Users, 
  PlusCircle, 
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ManagementDashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { analytics, isLoading, refetch } = useDashboardAnalytics();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Dashboard data is being updated...",
    });
    refetch();
  };

  const navigateToAddShop = () => {
    navigate('/management/shops');
    sessionStorage.setItem('openAddShopDialog', 'true');
  };

  const navigateToShopPerformance = () => {
    navigate('/management/shop-performance');
  };

  const navigateToUsers = () => {
    navigate('/management/users');
  };

  const navigateToOffers = () => {
    navigate('/management/offers');
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'year':
        return 'This Year';
      default:
        return 'This Month';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {getTimeRangeLabel()}'s overview
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-8 text-xs md:text-sm",
                timeRange === 'day' && "bg-white dark:bg-gray-700"
              )}
              onClick={() => setTimeRange('day')}
            >
              Day
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-8 text-xs md:text-sm",
                timeRange === 'week' && "bg-white dark:bg-gray-700"
              )}
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-8 text-xs md:text-sm",
                timeRange === 'month' && "bg-white dark:bg-gray-700"
              )}
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-8 text-xs md:text-sm",
                timeRange === 'year' && "bg-white dark:bg-gray-700"
              )}
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="text-xs md:text-sm"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="p-4 border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={navigateToAddShop}>
          <div className="flex flex-col items-center justify-center text-center h-20 md:h-24">
            <PlusCircle className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-sm md:text-base">Add New Shop</h3>
            <p className="text-xs text-muted-foreground">Register a new merchant</p>
          </div>
        </Card>
        
        <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={navigateToShopPerformance}>
          <div className="flex items-center justify-between h-20 md:h-24">
            <div>
              <h3 className="font-medium text-sm md:text-base">Shop Performance</h3>
              <p className="text-xs text-muted-foreground">View detailed metrics</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={navigateToUsers}>
          <div className="flex items-center justify-between h-20 md:h-24">
            <div>
              <h3 className="font-medium text-sm md:text-base">Partner</h3>
              <p className="text-xs text-muted-foreground">Manage partners</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={navigateToOffers}>
          <div className="flex items-center justify-between h-20 md:h-24">
            <div>
              <h3 className="font-medium text-sm md:text-base">Offers</h3>
              <p className="text-xs text-muted-foreground">Manage promotions</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg md:text-2xl font-bold">
              ₹{isLoading ? '...' : analytics?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg md:text-2xl font-bold">
              {isLoading ? '...' : analytics?.totalOrders.toLocaleString()}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +8.2% <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Shops</CardTitle>
            <Store className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg md:text-2xl font-bold">
              {isLoading ? '...' : analytics?.totalShops}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-purple-500 flex items-center">
                +1 <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> new this {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Users</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg md:text-2xl font-bold">
              {isLoading ? '...' : analytics?.totalUsers}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +32 <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> new users
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Revenue & Orders</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Monthly sales revenue and order count
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.monthlySalesData}
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 0 : 20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#8884d8"
                  width={isMobile ? 30 : 40}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#82ca9d"
                  width={isMobile ? 30 : 40}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Bar yAxisId="left" dataKey="totalSales" name="Revenue (₹)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="totalOrders" name="Orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base md:text-lg">Growth Trend</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Platform growth metrics
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                {timeRange}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.monthlySalesData}
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 0 : 20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis 
                  width={isMobile ? 30 : 40}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip contentStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <Area type="monotone" dataKey="totalSales" name="Revenue (₹)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="totalOrders" name="Orders" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Latest platform updates and events
              </CardDescription>
            </div>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Last 24 hours
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {[
                { type: 'shop', message: 'New shop "Fashion Hub" registered', time: '2 hours ago' },
                { type: 'order', message: 'Large order #1234 completed', time: '3 hours ago' },
                { type: 'user', message: '100 new partners joined', time: '5 hours ago' },
                { type: 'alert', message: 'System maintenance scheduled', time: '6 hours ago' },
                { type: 'offer', message: 'New promotion "Summer Sale" created', time: '8 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full",
                    activity.type === 'shop' && "bg-purple-500",
                    activity.type === 'order' && "bg-green-500",
                    activity.type === 'user' && "bg-blue-500",
                    activity.type === 'alert' && "bg-yellow-500",
                    activity.type === 'offer' && "bg-orange-500"
                  )} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementDashboard;
