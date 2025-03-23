import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  MessageSquare,
  Star
} from 'lucide-react';
import ShopAdminHeader from '@/components/admin/ShopAdminHeader';
import ProductsManager from '@/components/admin/ProductsManager';
import OrderDetailsView from '@/components/admin/OrderDetailsView';
import ShopOrdersList from '@/components/admin/ShopOrdersList';
import ShopDetailsEditor from '@/components/admin/ShopDetailsEditor';
import ShopFollowersList from '@/components/admin/ShopFollowersList';
import ShopSalesChart from '@/components/admin/ShopSalesChart';
import OffersManager from '@/components/admin/OffersManager';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shop } from '@/lib/shops/types';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [shopData, setShopData] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const fetchShopData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_email', currentUser.email)
          .limit(1);
        
        if (error) {
          console.error('Error fetching shop data:', error);
          setShopData(null);
        } else if (data && data.length > 0) {
          // Map database fields to Shop interface
          const shop: Shop = {
            id: data[0].id,
            name: data[0].name,
            description: data[0].description,
            logo: data[0].logo,
            coverImage: data[0].cover_image,
            address: data[0].address,
            ownerName: data[0].owner_name,
            ownerEmail: data[0].owner_email,
            phoneNumber: data[0].phone_number || '',
            rating: data[0].rating || 0,
            reviewCount: data[0].review_count || 0,
            followers: data[0].followers_count || 0,
            productIds: [], // This would need to be fetched separately
            isVerified: data[0].is_verified || false,
            status: data[0].status || 'pending',
            createdAt: data[0].created_at
          };
          setShopData(shop);
        } else {
          setShopData(null);
        }
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setShopData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [currentUser, navigate]);

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrder(orderId);
    setActiveTab('orders');
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  let tabContent;

  switch (activeTab) {
    case 'overview':
      tabContent = (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sales
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Customers
              </CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$6,969.00</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +12.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Products Sold
              </CardTitle>
              <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">452</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trending Product
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SmartWatch X</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +75% more sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Best Selling Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">August</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Record sales this year
              </p>
            </CardContent>
          </Card>
        </div>
      );
      break;
    case 'analytics':
      tabContent = (
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>A visual representation of your shop's sales data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: 1 hour ago
            </p>
            <Button variant="outline">
              View Full Report <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      );
      break;
    case 'products':
      tabContent = <ProductsManager shopId={shopData?.id || ''} />;
      break;
    case 'orders':
      tabContent = (
        <>
          <ShopOrdersList shopId={shopData?.id || ''} />
          {selectedOrder && <OrderDetailsView orderId={selectedOrder} shopId={shopData?.id || ''} onOrderUpdated={() => {}} />}
        </>
      );
      break;
    case 'followers':
      tabContent = <ShopFollowersList shopId={shopData?.id || ''} />;
      break;
    case 'details':
      tabContent = <ShopDetailsEditor shop={shopData} />;
      break;
    case 'offers':
      tabContent = <OffersManager shopId={shopData?.id || ''} />;
      break;
    default:
      tabContent = <div>Tab content not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ShopAdminHeader shop={shopData} />
      <div className="container mx-auto py-6">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="analytics" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="products" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="orders" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="followers" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="details" className="focus:outline-none">
            {tabContent}
          </TabsContent>
          <TabsContent value="offers" className="focus:outline-none">
            {tabContent}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
