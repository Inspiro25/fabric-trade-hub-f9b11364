
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

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  
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

  // Load wishlist products
  useEffect(() => {
    // Fetch product details for wishlist items
    const fetchWishlistProducts = async () => {
      // For now we'll use a placeholder approach since wishlist isn't integrated with database yet
      setWishlistProducts([]);
    };
    
    fetchWishlistProducts();
  }, [wishlist]);

  const handleMoveToCart = (product: Product) => {
    // This would need to be implemented when wishlist is integrated with database
    toast.info(`This feature will be implemented with wishlist database integration`);
  };

  return (
    <div className="animate-page-transition min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-2 max-w-7xl">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-4">Your Shopping Cart</h1>
          
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
                
                <WishlistSection 
                  wishlistProducts={wishlistProducts}
                  handleMoveToCart={handleMoveToCart}
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
