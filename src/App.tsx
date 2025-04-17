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
import Notifications from './components/Notifications'; // Add this import
import Help from '@/pages/Help'; // Add this import
import Partner from '@/pages/Partner'; // Add this import

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
import Login from '@/pages/Authentication'; // Using Authentication for Login
import Register from '@/pages/Authentication'; // Using Authentication for Register too
import ForgotPassword from '@/pages/Authentication'; // Using Authentication for ForgotPassword
import ResetPassword from '@/pages/Authentication'; // Using Authentication for ResetPassword
import Account from '@/pages/Profile'; // Using Profile as Account
import MyOrders from '@/pages/MyOrders';
import AccountWishlist from '@/pages/Wishlist'; // Using Wishlist as AccountWishlist
import AccountSettings from '@/pages/Settings'; // Using Settings as AccountSettings
import Search from '@/pages/Search';
import OrderSuccess from '@/pages/OrderConfirmation'; // Using OrderConfirmation as OrderSuccess
import Offers from '@/pages/Offers';
import AuthCallback from '@/pages/AuthCallback'; // Add this import

// Management pages
import ManagementLogin from '@/pages/ManagementLogin';
import ManagementDashboard from '@/pages/ManagementDashboard';
import ManagementShops from '@/pages/ManagementShops';
import ManagementUsers from '@/pages/ManagementPartners'; // Using ManagementPartners as ManagementUsers
import ManagementAnalytics from '@/pages/ManagementShopPerformance'; // Using ManagementShopPerformance as ManagementAnalytics
import ManagementSettings from '@/pages/Settings'; // Using Settings as ManagementSettings
import ManagementOffers from '@/pages/ManagementOffers';

// Admin pages
import AdminLogin from '@/pages/AdminLogin';
import ShopDashboard from '@/pages/ShopDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
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
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="search" element={<Search />} />
        <Route path="offers" element={<Offers />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
        <Route path="partner" element={<Partner />} />
      </Route>

      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="callback" element={<AuthCallback />} />
      </Route>

      <Route path="/account" element={<MainLayout />}>
        <Route index element={<Account />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="wishlist" element={<AccountWishlist />} />
        <Route path="settings" element={<AccountSettings />} />
      </Route>

      <Route path="/management" element={<DashboardLayout />}>
        <Route path="login" element={<ManagementLogin />} />
        <Route index element={<ManagementDashboard />} />
        <Route path="dashboard" element={<ManagementDashboard />} />
        <Route path="shops" element={<ManagementShops />} />
        <Route path="users" element={<ManagementUsers />} />
        <Route path="analytics" element={<ManagementAnalytics />} />
        <Route path="shop-performance" element={<ManagementAnalytics />} />
        <Route path="settings" element={<ManagementSettings />} />
        <Route path="offers" element={<ManagementOffers />} />
      </Route>

      <Route path="/admin">
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<ShopDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
