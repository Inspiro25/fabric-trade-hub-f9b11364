import { useState, useEffect, useMemo } from 'react';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/contexts/CartContext';
import CartToCheckout from '@/components/features/CartToCheckout';
import EmptyCart from '@/components/cart/EmptyCart';
import CartItemsList from '@/components/cart/CartItemsList';
import WishlistSection from '@/components/cart/WishlistSection';
import OrderSummary from '@/components/cart/OrderSummary';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isLoading } = useCart();
  const { currentUser, loading: authLoading } = useAuth();
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  // Memoize these calculations to prevent recalculations
  const subtotal = useMemo(() => getCartTotal(), [cartItems, getCartTotal]);
  const total = useMemo(() => subtotal - (subtotal * 0.1) + (subtotal > 100 ? 0 : 10), [subtotal]);
  const itemCount = useMemo(() => getCartCount(), [cartItems, getCartCount]);

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !currentUser) {
      setShowAuthDialog(true);
    }
  }, [authLoading, currentUser]);

  // Handle initial loading - improves performance by marking load as done quickly
  useEffect(() => {
    if (!initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [initialLoadDone]);

  // Handle content visibility after loading is complete
  useEffect(() => {
    if (!isLoading && initialLoadDone) {
      // Remove the delay to make content appear faster
      setIsContentLoaded(true);
    }
  }, [isLoading, initialLoadDone]);
  
  const handleLogin = () => {
    window.location.href = '/auth';
  };

  // Only show loading spinner on initial page load, not during navigation
  // and only when cart is actually still loading
  const showLoadingState = isLoading && !initialLoadDone && !isContentLoaded && authLoading;

  // Improved loading state with instant load for returning users
  if (showLoadingState) {
    return (
      <div className={cn(
        "animate-in fade-in min-h-screen flex items-center justify-center",
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30"
      )}>
        <div className="text-center">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin mx-auto",
            isDarkMode ? "text-orange-400" : "text-kutuku-primary" 
          )} />
          <p className={cn(
            "mt-4",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "animate-in fade-in min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30"
    )}>
      <main className="pt-4 pb-24 px-4 md:pt-8 md:pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full md:hidden",
                isDarkMode ? "bg-gray-800" : "bg-orange-50/80"
              )}>
                <ShoppingBag className={cn(
                  "h-4 w-4",
                  isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                )} />
              </div>
              <h1 className={cn(
                "text-lg md:text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Your Cart</h1>
            </div>
            <WishlistSection />
          </div>
          
          {!isLoading && cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <CartItemsList 
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  isLoaded={isContentLoaded}
                />
              </div>
              
              <OrderSummary 
                subtotal={subtotal}
                isLoaded={isContentLoaded}
              />
            </div>
          )}
        </div>
      </main>
      
      {cartItems.length > 0 && isMobile && (
        <CartToCheckout
          total={total}
          itemCount={itemCount}
        />
      )}
      
      <Footer />
      
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Authentication Required"
          message="You need to be logged in to view your cart."
        />
      )}
    </div>
  );
};

export default Cart;
