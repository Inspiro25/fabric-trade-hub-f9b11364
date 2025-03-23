import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, Store, Users, PlusCircle, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ManagementDashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { analytics, isLoading, refetch } = useDashboardAnalytics();
  const { toast } = useToast();

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

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            Refresh
          </Button>
          <span className="text-xs md:text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <Card className="p-4 border-dashed border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={navigateToAddShop}>
          <div className="flex flex-col items-center justify-center text-center h-24">
            <PlusCircle className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium">Add New Shop</h3>
            <p className="text-xs text-muted-foreground">Register a new merchant</p>
          </div>
        </Card>
        
        <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={navigateToShopPerformance}>
          <div className="flex items-center justify-between h-24">
            <div>
              <h3 className="font-medium">Shop Performance</h3>
              <p className="text-xs text-muted-foreground">View detailed performance metrics</p>
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
              ${isLoading ? '...' : analytics?.totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> from last month
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
              </span> from last month
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
              </span> new this month
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
      
      {/* Chart - Removed the tabs and only kept the overview chart */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Revenue & Orders</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Monthly sales revenue and order count
            </CardDescription>
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
                <Bar yAxisId="left" dataKey="totalSales" name="Revenue ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="totalOrders" name="Orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Growth Trend</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Platform growth metrics
            </CardDescription>
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
                <Area type="monotone" dataKey="totalSales" name="Revenue ($)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="totalOrders" name="Orders" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagementDashboard;
