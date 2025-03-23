
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout components
import MainLayout from '@/components/layout/MainLayout';
import DashboardLayout from '@/components/management/DashboardLayout';

// Main pages
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Products from '@/pages/Products';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';
import ShopDetail from '@/pages/ShopDetail';
import Shops from '@/pages/Shops';
import Cart from '@/pages/Cart';
import Categories from '@/pages/Categories';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Account from '@/pages/Account';
import AccountOrders from '@/pages/AccountOrders';
import AccountWishlist from '@/pages/AccountWishlist';
import AccountSettings from '@/pages/AccountSettings';
import Search from '@/pages/Search';
import OrderSuccess from '@/pages/OrderSuccess';

// Management pages
import ManagementLogin from '@/pages/ManagementLogin';
import ManagementDashboard from '@/pages/ManagementDashboard';
import ManagementShops from '@/pages/ManagementShops';
import ManagementUsers from '@/pages/ManagementUsers';
import ManagementAnalytics from '@/pages/ManagementAnalytics';
import ManagementSettings from '@/pages/ManagementSettings';
import ManagementOffers from '@/pages/ManagementOffers';

// Admin pages
import AdminLogin from '@/pages/AdminLogin';
import ShopDashboard from '@/pages/ShopDashboard';

function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:id" element={<ShopDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="categories" element={<Categories />} />
        <Route path="search" element={<Search />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="account" element={<Account />} />
        <Route path="account/orders" element={<AccountOrders />} />
        <Route path="account/wishlist" element={<AccountWishlist />} />
        <Route path="account/settings" element={<AccountSettings />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Management routes */}
      <Route path="management/login" element={<ManagementLogin />} />
      <Route path="management" element={<DashboardLayout />}>
        <Route path="dashboard" element={<ManagementDashboard />} />
        <Route path="shops" element={<ManagementShops />} />
        <Route path="users" element={<ManagementUsers />} />
        <Route path="analytics" element={<ManagementAnalytics />} />
        <Route path="settings" element={<ManagementSettings />} />
        <Route path="offers" element={<ManagementOffers />} />
      </Route>

      {/* Shop admin routes */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/dashboard" element={<ShopDashboard />} />
    </Routes>
  );
}

export default App;
