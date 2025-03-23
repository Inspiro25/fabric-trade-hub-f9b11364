
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, Users, LogOut, Store, Tag, 
  BarChart, Settings, Inbox, ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getShopById } from '@/lib/supabase/shops';
import { Shop } from '@/lib/shops/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ShopInfoCard from '@/components/admin/ShopInfoCard';
import ShopSalesStats from '@/components/admin/ShopSalesStats';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const adminShopId = sessionStorage.getItem('adminShopId');
      
      if (!adminShopId) {
        toast.error('You must be logged in as a shop administrator');
        navigate('/admin/login');
        return;
      }
      
      setIsLoading(true);
      
      try {
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

  const handleLogout = () => {
    sessionStorage.removeItem('adminShopId');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vyoma-primary"></div>
        <p className="mt-4 text-gray-500">Loading shop dashboard...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <Store className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-2">Shop Not Found</h2>
          <p className="mb-6 text-gray-500">We couldn't find your shop details.</p>
          <Button onClick={() => navigate('/admin/login')}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <header className={cn(
        "py-4 px-6 flex justify-between items-center border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className={cn(
              isDarkMode ? "bg-gray-700 text-orange-400" : "bg-vyoma-light text-vyoma-primary"
            )}>
              {shop.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className={cn(
              "font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              {shop.name}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={
                shop.status === 'active' ? 'success' : 
                shop.status === 'pending' ? 'warning' : 'destructive'
              }>
                {shop.status}
              </Badge>
              {shop.isVerified && 
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                  Verified
                </Badge>
              }
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            <span className={isMobile ? "sr-only" : ""}>Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Shop Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner:</span>
                  <span className="font-medium">{shop.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{shop.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{shop.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium">{shop.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Followers:</span>
                  <span className="font-medium">{shop.followers_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ShopSalesStats shopId={shop.id} />
        </div>

        <Separator className="my-6" />

        <h2 className={cn(
          "text-xl font-semibold mb-4",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" onClick={() => navigate('/shop/' + shop.id)} className="h-auto py-4 justify-start gap-3">
            <Store className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">View Shop</div>
              <div className="text-sm text-gray-500">See your shop's page</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start gap-3" onClick={() => setOpenOrderDialog(true)}>
            <ShoppingBag className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Orders</div>
              <div className="text-sm text-gray-500">Manage shop orders</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start gap-3">
            <Tag className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Products</div>
              <div className="text-sm text-gray-500">Manage your products</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto py-4 justify-start gap-3" onClick={() => setOpenSettingsDialog(true)}>
            <Settings className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Settings</div>
              <div className="text-sm text-gray-500">Edit shop settings</div>
            </div>
          </Button>
        </div>
      </main>

      <Dialog open={openOrderDialog} onOpenChange={setOpenOrderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Orders</DialogTitle>
            <DialogDescription>
              This feature is coming soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <ShoppingBag className="h-16 w-16 text-gray-300" />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shop Settings</DialogTitle>
            <DialogDescription>
              Edit your shop details and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button onClick={() => navigate('/admin/dashboard/settings')}>
              Open Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
