
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductsManager from '@/components/admin/ProductsManager';
import OffersManager from '@/components/admin/OffersManager';
import { Shop } from '@/lib/shops/types';
import { useNotifications } from '@/contexts/NotificationContext';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalShops: 0,
    totalProducts: 0
  });
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/sign-in');
    } else {
      loadShops();
      fetchAdminStats();
    }
  }, [currentUser, navigate]);
  
  const loadShops = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const fetchedShops = data as Shop[];
      setShops(fetchedShops);
      if (fetchedShops.length > 0) {
        setSelectedShop(fetchedShops[0]);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      // Fetch total shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('id');
      
      if (shopsError) throw shopsError;
      
      // Fetch total orders and revenue
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total');
      
      if (ordersError) throw ordersError;
      
      // Fetch total products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id');
      
      if (productsError) throw productsError;
      
      // Calculate total revenue
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalShops: shopsData.length,
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        totalProducts: productsData.length
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const manageShop = (shop: Shop) => {
    // Store the shop ID in session storage for shop admin panel
    sessionStorage.setItem('adminShopId', shop.id);
    navigate('/admin/dashboard');
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Helmet>
        <title>Admin Dashboard | E-Commerce App</title>
        <meta name="description" content="Admin dashboard for managing the e-commerce application" />
      </Helmet>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalShops}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                </CardContent>
              </Card>
            </div>
          
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Card className="w-full md:w-1/4">
                <CardHeader>
                  <CardTitle>Shop Management</CardTitle>
                  <CardDescription>Manage shops and their products.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="shop">Select Shop</Label>
                    <Select value={selectedShop?.id} onValueChange={(value) => {
                      const shop = shops.find(shop => shop.id === value);
                      setSelectedShop(shop || null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shop" />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedShop && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => manageShop(selectedShop)}
                        >
                          Manage Shop Admin Panel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full md:w-3/4">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Manage products for the selected shop.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedShop ? (
                    <ProductsManager shopId={selectedShop?.id} />
                  ) : (
                    <p>Please select a shop to manage products.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Offers Management</CardTitle>
                <CardDescription>Manage offers and promotions for the selected shop.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedShop ? (
                  <OffersManager shopId={selectedShop?.id} />
                ) : (
                  <p>Please select a shop to manage offers.</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Shop Admins</CardTitle>
                <CardDescription>Manage shop administrators and their access.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedShop ? (
                  <ShopAdminsManager shopId={selectedShop?.id} />
                ) : (
                  <p>Please select a shop to manage admins.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

// Shop Admins Manager Component
const ShopAdminsManager: React.FC<{shopId: string}> = ({ shopId }) => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  
  useEffect(() => {
    if (shopId) {
      fetchShopAdmins();
    }
  }, [shopId]);
  
  const fetchShopAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shop_admins')
        .select(`
          id,
          role,
          user_id,
          created_at,
          user_profiles:user_id (
            display_name,
            email
          )
        `)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching shop admins:', error);
      toast.error('Failed to load shop administrators');
    } finally {
      setLoading(false);
    }
  };
  
  const addShopAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    setAddingAdmin(true);
    try {
      // First, get the user ID from the user_profiles table using their email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', newAdminEmail.trim())
        .single();
      
      if (userError) {
        toast.error('User not found with this email');
        return;
      }
      
      // Check if the admin already exists for this shop
      const { data: existingAdmin, error: checkError } = await supabase
        .from('shop_admins')
        .select('id')
        .eq('shop_id', shopId)
        .eq('user_id', userData.id)
        .single();
      
      if (existingAdmin) {
        toast.error('This user is already an admin for this shop');
        return;
      }
      
      // Add the user as a shop admin
      const { error: insertError } = await supabase
        .from('shop_admins')
        .insert({
          shop_id: shopId,
          user_id: userData.id,
          role: 'admin'
        });
      
      if (insertError) throw insertError;
      
      toast.success('Shop administrator added successfully');
      setNewAdminEmail('');
      fetchShopAdmins();
    } catch (error) {
      console.error('Error adding shop admin:', error);
      toast.error('Failed to add shop administrator');
    } finally {
      setAddingAdmin(false);
    }
  };
  
  const removeShopAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('shop_admins')
        .delete()
        .eq('id', adminId)
        .eq('shop_id', shopId);
      
      if (error) throw error;
      
      toast.success('Shop administrator removed successfully');
      fetchShopAdmins();
    } catch (error) {
      console.error('Error removing shop admin:', error);
      toast.error('Failed to remove shop administrator');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input
            id="admin-email"
            placeholder="Enter email address"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
        </div>
        <Button onClick={addShopAdmin} disabled={addingAdmin || !newAdminEmail.trim()}>
          {addingAdmin ? 'Adding...' : 'Add Admin'}
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Loading admins...
              </TableCell>
            </TableRow>
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No administrators found for this shop
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.user_profiles?.display_name || 'Unknown'}</TableCell>
                <TableCell>{admin.user_profiles?.email || 'No email'}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  {new Date(admin.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeShopAdmin(admin.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
