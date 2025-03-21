
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Authentication from "./pages/Authentication";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Offers from "./pages/Offers";
import Notifications from "./pages/Notifications";
import Orders from "./pages/Orders";
import Tracking from "./pages/Tracking";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import { lazy, Suspense } from "react";
import MobileAppLayout from "./components/features/MobileAppLayout";
import { useIsMobile } from "./hooks/use-mobile";

// Import the CategorySection component for category routes
import CategorySection from "./components/features/CategorySection";

// Import new Shop components
import Shops from "./pages/Shops";
import ShopDetail from "./pages/ShopDetail";

// Import new admin components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Import new management components
import ManagementLogin from "./pages/ManagementLogin";
import DashboardLayout from "./components/management/DashboardLayout";
import ManagementDashboard from "./pages/ManagementDashboard";
import ManagementShops from "./pages/ManagementShops";
import ManagementOffers from "./pages/ManagementOffers";
import ManagementShopPerformance from "./pages/ManagementShopPerformance";

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobile = useIsMobile();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-subtle">Loading...</div>
      </div>
    }>
      {isMobile ? (
        <MobileAppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tracking/:id" element={<Tracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            {/* Add routes for shops */}
            <Route path="/shops" element={<Shops />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            {/* Add a route for categories */}
            <Route path="/category/:categoryName" element={<CategorySection />} />
            {/* Add admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add management portal routes */}
            <Route path="/management/login" element={<ManagementLogin />} />
            <Route path="/management" element={<DashboardLayout />}>
              <Route path="dashboard" element={<ManagementDashboard />} />
              <Route path="shops" element={<ManagementShops />} />
              <Route path="offers" element={<ManagementOffers />} />
              <Route path="shop-performance" element={<ManagementShopPerformance />} />
              <Route path="analytics" element={<ManagementDashboard />} />
              <Route path="users" element={<ManagementDashboard />} />
              <Route path="settings" element={<ManagementDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileAppLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tracking/:id" element={<Tracking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          {/* Add routes for shops */}
          <Route path="/shops" element={<Shops />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          {/* Add a route for categories */}
          <Route path="/category/:categoryName" element={<CategorySection />} />
          {/* Add admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Add management portal routes */}
          <Route path="/management/login" element={<ManagementLogin />} />
          <Route path="/management" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ManagementDashboard />} />
            <Route path="shops" element={<ManagementShops />} />
            <Route path="offers" element={<ManagementOffers />} />
            <Route path="shop-performance" element={<ManagementShopPerformance />} />
            <Route path="analytics" element={<ManagementDashboard />} />
            <Route path="users" element={<ManagementDashboard />} />
            <Route path="settings" element={<ManagementDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <ThemeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
