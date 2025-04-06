
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart, DollarSign, ShoppingCart, Store, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalShops: 0,
    totalUsers: 0,
    isLoading: true
  });

  useEffect(() => {
    // Check auth
    const adminUsername = sessionStorage.getItem('adminUsername');
    if (!adminUsername) {
      navigate('/management/login');
      return;
    }

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // Get total orders
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Get total shops
        const { count: shopsCount, error: shopsError } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true });

        // Get total users from user_profiles
        const { count: usersCount, error: usersError } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        // Get total revenue
        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total');

        // Calculate total revenue
        const totalRevenue = revenueData ? revenueData.reduce((sum, order) => sum + (order.total || 0), 0) : 0;

        setStats({
          totalOrders: ordersCount || 0,
          totalRevenue,
          totalShops: shopsCount || 0,
          totalUsers: usersCount || 0,
          isLoading: false
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : `$${stats.totalRevenue.toFixed(2)}`}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.totalOrders}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.totalShops}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {stats.isLoading ? '...' : stats.totalUsers}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <BarChart size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground">Activity data will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Most popular product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <PieChart size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-muted-foreground">Category data will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
