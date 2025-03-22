import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
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
import { fetchShops } from '@/lib/supabase/shops';
import { Shop } from '@/lib/shops/types';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth/sign-in');
    } else {
      loadShops();
    }
  }, [user, navigate]);
  
  const loadShops = async () => {
    setIsLoading(true);
    try {
      const fetchedShops = await fetchShops();
      setShops(fetchedShops);
      if (fetchedShops.length > 0) {
        setSelectedShop(fetchedShops[0]);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shops',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
