import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileSearch from './components/mobile/MobileSearch';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { OrderProvider } from '@/contexts/OrderContext';
import ErrorBoundary from './components/ErrorBoundary';
import Wishlist from '@/pages/Wishlist';
import Notifications from './components/Notifications'; 
import Help from '@/pages/Help';
import Partner from '@/pages/Partner';
import AddressManagement from '@/pages/AddressManagement';
import RequireAuth from '@/components/auth/RequireAuth';

// Layout components
import MainLayout from '@/components/layout/MainLayout';
import DashboardLayout from '@/components/management/DashboardLayout';

// Main pages
import Home from '@/pages/Index';
import ProductDetail from '@/pages/ProductDetail';
import Products from '@/pages/TrendingNow'; // Using TrendingNow as Products page
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';
import ShopDetail from '@/pages/ShopDetail';
import Shops from '@/pages/Shops';
import Cart from '@/pages/Cart';
import NewArrivals from '@/pages/NewArrivals'; // Using NewArrivals as Categories page
import CategoryPage from '@/pages/CategoryPage'; // New category page
import UnifiedLogin from '@/pages/UnifiedLogin';
import Account from '@/pages/Profile'; // Using Profile as Account
import MyOrders from '@/pages/MyOrders';
import AccountWishlist from '@/pages/Wishlist'; // Using Wishlist as AccountWishlist
import AccountSettings from '@/pages/Settings'; // Using Settings as AccountSettings
import Search from '@/pages/Search';
import OrderSuccess from '@/pages/OrderConfirmation'; // Using OrderConfirmation as OrderSuccess
import Offers from '@/pages/Offers';
import AuthCallback from '@/pages/AuthCallback'; // Add this import

// Management pages
import ManagementDashboard from '@/pages/ManagementDashboard';
import ManagementShops from '@/pages/ManagementShops';
import ManagementUsers from '@/pages/ManagementPartners'; // Using ManagementPartners as ManagementUsers
import ManagementAnalytics from '@/pages/ManagementShopPerformance'; // Using ManagementShopPerformance as ManagementAnalytics
import ManagementSettings from '@/pages/Settings'; // Using Settings as ManagementSettings
import ManagementOffers from '@/pages/ManagementOffers';
import ManagementSupport from './pages/ManagementSupport';

// Admin pages
import ShopDashboard from '@/pages/ShopDashboard';
// Using ShopDashboard since AdminDashboard doesn't exist
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:id" element={<ShopDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="categories" element={<NewArrivals />} />
        <Route path="categories/:id" element={<CategoryPage />} />
        <Route path="checkout" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
        <Route path="order-success" element={
          <RequireAuth>
            <OrderSuccess />
          </RequireAuth>
        } />
        <Route path="search" element={<Search />} />
        <Route path="offers" element={<Offers />} />
        <Route path="notifications" element={
          <RequireAuth>
            <Notifications />
          </RequireAuth>
        } />
        <Route path="help" element={<Help />} />
        <Route path="partner" element={<Partner />} />
      </Route>

      <Route path="/auth">
        <Route path="login" element={<UnifiedLogin />} />
        <Route path="callback" element={<AuthCallback />} />
      </Route>

      <Route path="/account" element={
        <RequireAuth>
          <MainLayout />
        </RequireAuth>
      }>
        <Route index element={<Account />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="wishlist" element={<AccountWishlist />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route path="addresses" element={<AddressManagement />} />
      </Route>

      <Route path="/management" element={
        <RequireAuth adminOnly={true} redirectTo='/auth/login'>
          <DashboardLayout />
        </RequireAuth>
      }>
        <Route path="login" element={<UnifiedLogin />} />
        <Route index element={<ManagementDashboard />} />
        <Route path="dashboard" element={<ManagementDashboard />} />
        <Route path="shops" element={<ManagementShops />} />
        <Route path="users" element={<ManagementUsers />} />
        <Route path="analytics" element={<ManagementAnalytics />} />
        <Route path="shop-performance" element={<ManagementAnalytics />} />
        <Route path="settings" element={<ManagementSettings />} />
        <Route path="offers" element={<ManagementOffers />} />
        <Route path="support" element={<ManagementSupport />} />
      </Route>

      <Route path="/admin" element={
        <RequireAuth shopAdminOnly={true} redirectTo='/auth/login'>
          <MainLayout />
        </RequireAuth>
      }>
        <Route path="login" element={<UnifiedLogin />} />
        <Route path="dashboard" element={<ShopDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
