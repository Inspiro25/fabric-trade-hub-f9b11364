
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
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

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isLoading } = useCart();
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  
  const subtotal = getCartTotal();
  const total = subtotal - (subtotal * 0.1) + (subtotal > 100 ? 0 : 10);
  const itemCount = getCartCount();

  // Handle initial loading
  useEffect(() => {
    // Set initial load done after a short delay to prevent unnecessary loading state
    if (!initialLoadDone) {
      const timer = setTimeout(() => {
        setInitialLoadDone(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialLoadDone]);

  // Handle content visibility after loading is complete
  useEffect(() => {
    if (!isLoading && initialLoadDone) {
      // Short delay to ensure smooth transition
      const contentTimer = setTimeout(() => {
        setIsContentLoaded(true);
      }, 100);
      return () => clearTimeout(contentTimer);
    }
  }, [isLoading, initialLoadDone]);

  // True loading state - show only during initial load
  if (isLoading && !initialLoadDone) {
    return (
      <div className={cn(
        "animate-page-transition min-h-screen flex items-center justify-center",
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
      )}>
        <Navbar />
        <div className="text-center">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin mx-auto",
            isDarkMode ? "text-orange-400" : "text-kutuku-primary" 
          )} />
          <p className={cn(
            "mt-4",
            isDarkMode ? "text-gray-300" : "text-muted-foreground"
          )}>Loading your cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={cn(
      "animate-page-transition min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-orange-50/80 to-white"
    )}>
      <Navbar />
      
      <main className="pt-12 pb-24 px-4 md:pt-16 md:pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-full md:hidden",
                isDarkMode ? "bg-gray-800" : "bg-kutuku-light"
              )}>
                <ShoppingBag className={cn(
                  "h-4 w-4",
                  isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                )} />
              </div>
              <h1 className={cn(
                "text-lg md:text-2xl font-bold",
                isDarkMode && "text-white"
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
    </div>
  );
};

export default Cart;
