
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ManagementLayout from '@/components/layout/ManagementLayout';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import ProductDetail from '@/pages/ProductDetail';
import CategoryPage from '@/pages/CategoryPage';
import ShopDetail from '@/pages/ShopDetail';
import Offers from '@/pages/Offers';
import NewArrivals from '@/pages/NewArrivals';
import AdminLogin from '@/pages/AdminLogin';
import ShopDashboard from '@/pages/ShopDashboard';
import ShopProductsManager from '@/pages/ShopProductsManager';
import AdminSettings from '@/pages/AdminSettings';
import ManagementDashboard from '@/pages/ManagementDashboard';
import ManagementShops from '@/pages/ManagementShops';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const App: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();

  return (
    <div className={cn("min-h-screen", isDarkMode ? "dark" : "")}>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="search" element={<Search />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="category/:id" element={<CategoryPage />} />
                    <Route path="shop/:id" element={<ShopDetail />} />
                    <Route path="new-arrivals" element={<NewArrivals />} />
                    <Route path="offers" element={<Offers />} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<ShopDashboard />} />
                  <Route path="/admin/products" element={<ShopProductsManager />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  
                  {/* Management Routes */}
                  <Route path="/management" element={<ManagementLayout />}>
                    <Route path="dashboard" element={<ManagementDashboard />} />
                    <Route path="shops" element={<ManagementShops />} />
                  </Route>
                </Routes>
                <Toaster />
              </RecentlyViewedProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
