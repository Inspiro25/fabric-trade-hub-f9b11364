
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/products';
import CartToCheckout from '@/components/features/CartToCheckout';
import EmptyCart from '@/components/cart/EmptyCart';
import CartItemsList from '@/components/cart/CartItemsList';
import WishlistSection from '@/components/cart/WishlistSection';
import OrderSummary from '@/components/cart/OrderSummary';
import { Loader2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, isLoading } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  const subtotal = getCartTotal();
  const total = subtotal - (subtotal * 0.1) + (subtotal > 100 ? 0 : 10);
  const itemCount = getCartCount();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-page-transition min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-kutuku-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="animate-page-transition min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-12 pb-24 px-4 md:pt-16 md:pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-kutuku-light p-1.5 rounded-full md:hidden">
                <ShoppingBag className="h-4 w-4 text-kutuku-primary" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold">Your Cart</h1>
            </div>
            <WishlistSection />
          </div>
          
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <CartItemsList 
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  isLoaded={isLoaded}
                />
              </div>
              
              <OrderSummary 
                subtotal={subtotal}
                isLoaded={isLoaded}
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
