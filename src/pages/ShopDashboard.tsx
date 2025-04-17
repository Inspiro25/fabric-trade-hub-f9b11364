import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users, Settings, Store, Package, ShoppingBag } from 'lucide-react';
import ShopSalesChart from '@/components/admin/ShopSalesChart';
import ShopFollowersList from '@/components/admin/ShopFollowersList';
import { getShopById } from '@/lib/supabase/shops';
import { Shop } from '@/lib/shops/types';
import { toast } from 'sonner';
import { fetchShopFollowers } from '@/lib/supabase/shopFollows';
import { fetchShopSalesAnalytics } from '@/lib/supabase/analytics';
import ShopAdminHeader from '@/components/admin/ShopAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import ShopOrdersList from '@/components/admin/ShopOrdersList';
import ShopSettings from '@/components/admin/ShopSettings';
import { ShopFollowers } from '@/components/shop/ShopFollowers';

const ShopDashboard = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [followerCount, setFollowerCount] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const isMobile = useIsMobile();

  const loadShopData = async (shopId: string) => {
    setIsLoading(true);
    try {
      // Fetch shop details
      const shopData = await getShopById(shopId);
      
      if (!shopData) {
        throw new Error('Shop not found');
      }
      
      setShop(shopData);
      
      // Fetch shop followers count
      const followers = await fetchShopFollowers(shopId);
      setFollowerCount(followers.length);
      
      // Fetch sales analytics
      const analytics = await fetchShopSalesAnalytics(shopId);
      setSalesData(analytics);
      
      // Calculate monthly revenue and order count
      const monthly = analytics.reduce((acc, item) => {
        return {
          revenue: acc.revenue + Number(item.sales_amount || 0),
          orders: acc.orders + Number(item.orders_count || 0)
        };
      }, { revenue: 0, orders: 0 });
      
      setMonthlyRevenue(monthly.revenue);
      setOrderCount(monthly.orders);
    } catch (error) {
      console.error('Error loading shop data:', error);
      toast.error('Failed to load shop data');
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminAuth = async () => {
      // Get the shop ID from session storage
      const adminShopId = sessionStorage.getItem('adminShopId');
      
      if (!adminShopId) {
        toast.error('You must be logged in as a shop administrator');
        navigate('/admin/login');
        return;
      }
      
      await loadShopData(adminShopId);
    };
    
    checkAdminAuth();
  }, [navigate]);

  const handleSettingsUpdate = async () => {
    // Refresh shop data after settings update
    const adminShopId = sessionStorage.getItem('adminShopId');
    if (adminShopId) {
      await loadShopData(adminShopId);
      toast.success('Shop information updated successfully');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-kutuku-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <p className="mb-6">The shop you're trying to access doesn't exist.</p>
        <button 
          onClick={() => navigate('/admin/login')}
          className="bg-kutuku-primary text-white px-6 py-2 rounded-md hover:bg-kutuku-secondary"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <ShopAdminHeader shop={shop} isMobile={isMobile} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From the past 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total processed orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{followerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              People following your shop
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="followers">
            <Users className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Followers</span>
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Products</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                View your shop's sales performance over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ShopSalesChart data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>
                View and manage customer orders for your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shop && <ShopOrdersList shopId={shop.id} />}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          {shop && <ShopSettings shop={shop} onUpdateSuccess={handleSettingsUpdate} />}
        </TabsContent>
        
        <TabsContent value="followers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shop Followers</CardTitle>
              <CardDescription>
                People who are following your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShopFollowers shopId={shop.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>
                Add, edit or remove products from your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="py-4 text-center text-muted-foreground">
                Product management coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;
