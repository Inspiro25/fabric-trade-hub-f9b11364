
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, Store, Users } from 'lucide-react';

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
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54,200</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +12.5% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,150</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +8.2% <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shops</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-500 flex items-center">
                +1 <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> new this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                +32 <ArrowUpRight className="h-3 w-3 ml-1" />
              </span> new users
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shops">Shops Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders</CardTitle>
              <CardDescription>
                Monthly sales revenue and order count for the current year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalSales" name="Revenue ($)" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="totalOrders" name="Orders" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Growth Trend</CardTitle>
              <CardDescription>
                Platform growth in revenue and user acquisition
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="totalSales" name="Revenue ($)" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="totalOrders" name="Orders" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shops" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shopsData.map((shop) => (
              <Card key={shop.name}>
                <CardHeader>
                  <CardTitle>{shop.name}</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Sales:</span>
                      <span className="font-medium">${shop.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Orders:</span>
                      <span className="font-medium">{shop.orders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profit:</span>
                      <span className="font-medium">${shop.profit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate:</span>
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
