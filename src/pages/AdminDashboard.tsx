
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getShopById } from '@/lib/shops';
import { getShopProducts } from '@/lib/shops';
import { Product } from '@/lib/products';
import { Store, Package, LogOut, Plus, Settings, ChevronLeft } from 'lucide-react';
import ShopDetailsEditor from '@/components/admin/ShopDetailsEditor';
import ProductsManager from '@/components/admin/ProductsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [shopId, setShopId] = useState<string | null>(null);
  const [shop, setShop] = useState<any>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is logged in
      const adminShopId = sessionStorage.getItem('adminShopId');
      
      if (!adminShopId) {
        navigate('/admin/login');
        return;
      }
      
      setShopId(adminShopId);
      
      try {
        // Fetch shop data
        const shopData = await getShopById(adminShopId);
        if (!shopData) {
          navigate('/admin/login');
          return;
        }
        
        setShop(shopData);
        
        // Fetch shop products
        const productsData = await getShopProducts(adminShopId);
        setShopProducts(productsData);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminShopId');
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!shop) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Site
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center">
              <div className="mr-3 text-sm font-medium hidden md:block">
                {shop.name} Admin
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm">
            <img 
              src={shop.logo} 
              alt={`${shop.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold">{shop.name}</h1>
            <p className="text-sm text-gray-500">Shop Admin Dashboard</p>
          </div>
        </div>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center">
              <Store className="h-4 w-4 mr-2" />
              Shop Details
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductsManager shopId={shop.id} products={shopProducts} />
          </TabsContent>
          
          <TabsContent value="shop">
            <ShopDetailsEditor shop={shop} />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  This section will allow you to change your password and notification preferences.
                </p>
                <div className="mt-4">
                  <Button disabled>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
