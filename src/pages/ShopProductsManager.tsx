
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ShoppingBag, Store, Settings, BarChart, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import ProductsManager from '@/components/admin/ProductsManager';
import ShopAdminHeader from '@/components/admin/ShopAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { Shop } from '@/lib/shops/types';
import { getShopById } from '@/lib/supabase/shops';

const ShopProductsManager = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      // Get the shop ID from session storage
      const adminShopId = sessionStorage.getItem('adminShopId');
      
      if (!adminShopId) {
        toast.error('You must be logged in as a shop administrator');
        navigate('/admin/login');
        return;
      }
      
      try {
        // Fetch shop details
        const shopData = await getShopById(adminShopId);
        
        if (!shopData) {
          throw new Error('Shop not found');
        }
        
        setShop(shopData);
      } catch (error) {
        console.error('Error loading shop data:', error);
        toast.error('Failed to load shop data');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminAuth();
  }, [navigate]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Navigate based on tab selection
    if (value === 'overview') {
      navigate('/admin/dashboard');
    } else if (value === 'products') {
      navigate('/admin/products');
    } else if (value === 'orders') {
      navigate('/admin/orders');
    } else if (value === 'settings') {
      navigate('/admin/settings');
    } else if (value === 'followers') {
      navigate('/admin/followers');
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
        <Button 
          onClick={() => navigate('/admin/login')}
          className="bg-kutuku-primary text-white px-6 py-2 rounded-md hover:bg-kutuku-secondary"
        >
          Return to Login
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-8">
      <ShopAdminHeader shop={shop} isMobile={isMobile} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
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
            <Store className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'hidden' : 'inline'}>Products</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="mt-6">
        {shop && <ProductsManager shopId={shop.id} />}
      </div>
    </div>
  );
};

export default ShopProductsManager;
