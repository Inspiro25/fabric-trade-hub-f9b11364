
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, Store, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for charts
const salesData = [
  { month: 'Jan', totalSales: 6500, totalOrders: 120 },
  { month: 'Feb', totalSales: 8900, totalOrders: 150 },
  { month: 'Mar', totalSales: 7200, totalOrders: 135 },
  { month: 'Apr', totalSales: 9800, totalOrders: 170 },
  { month: 'May', totalSales: 11300, totalOrders: 190 },
  { month: 'Jun', totalSales: 10500, totalOrders: 180 },
];

const shopsData = [
  { name: 'Electronics Hub', sales: 28500, orders: 450, profit: 9800 },
  { name: 'Fashion Trends', sales: 19200, orders: 380, profit: 6400 },
  { name: 'Home Essentials', sales: 15800, orders: 320, profit: 5300 },
];

const ManagementDashboard = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg md:text-2xl font-bold">$54,200</div>
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
            <div className="text-lg md:text-2xl font-bold">1,150</div>
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
            <div className="text-lg md:text-2xl font-bold">3</div>
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
            <div className="text-lg md:text-2xl font-bold">573</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +32 <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 ml-1" />
              </span> new users
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="shops" className="text-xs md:text-sm">Shop Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                  data={salesData}
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
                  data={salesData}
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
        </TabsContent>
        
        <TabsContent value="shops" className="space-y-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {shopsData.map((shop) => (
              <Card key={shop.name}>
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="text-base md:text-lg">{shop.name}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-xs md:text-sm">
                    <div className="flex items-center justify-between">
                      <span>Total Sales:</span>
                      <span className="font-medium">${shop.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Orders:</span>
                      <span className="font-medium">{shop.orders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Profit:</span>
                      <span className="font-medium">${shop.profit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">{Math.round((shop.orders / 1200) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagementDashboard;
