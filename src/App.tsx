import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ShoppingCartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ManagementLayout from '@/components/layout/ManagementLayout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Search from '@/pages/Search';
import ProductDetail from '@/pages/ProductDetail';
import CategoryPage from '@/pages/CategoryPage';
import ShopDetail from '@/pages/ShopDetail';
import CartPage from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProfilePage from '@/pages/ProfilePage';
import FAQ from '@/pages/FAQ';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NewArrivals from '@/pages/NewArrivals';
import TrendingPage from '@/pages/TrendingPage';
import FlashSalePage from '@/pages/FlashSalePage';
import Offers from '@/pages/Offers';
import Page404 from '@/pages/Page404';
import AdminLogin from '@/pages/AdminLogin';
import ShopDashboard from '@/pages/ShopDashboard';
import ShopProductsManager from '@/pages/ShopProductsManager';
import AdminSettings from '@/pages/AdminSettings';
import ManagementDashboard from '@/pages/ManagementDashboard';
import ManagementShops from '@/pages/ManagementShops';
import ManagementCategories from '@/pages/ManagementCategories';
import ManagementUsers from '@/pages/ManagementUsers';
import ManagementSettings from '@/pages/ManagementSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();

  return (
    <div className={cn("min-h-screen", isDarkMode ? "dark" : "")}>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ShoppingCartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Index />} />
                        <Route path="search" element={<Search />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        <Route path="category/:id" element={<CategoryPage />} />
                        <Route path="shop/:id" element={<ShopDetail />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route path="wishlist" element={<WishlistPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="faq" element={<FAQ />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="new-arrivals" element={<NewArrivals />} />
                        <Route path="trending" element={<TrendingPage />} />
                        <Route path="flash-sale" element={<FlashSalePage />} />
                        <Route path="offers" element={<Offers />} />
                        <Route path="*" element={<Page404 />} />
                      </Route>
                      
                      <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
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
                        <Route path="categories" element={<ManagementCategories />} />
                        <Route path="users" element={<ManagementUsers />} />
                        <Route path="settings" element={<ManagementSettings />} />
                      </Route>
                    </Routes>
                  </Router>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </ShoppingCartProvider>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
