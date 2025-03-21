
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/lib/products';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CartToCheckout from '@/components/features/CartToCheckout';

// Mock cart items for demonstration
const initialCartItems = [{
  id: products[0].id,
  product: products[0],
  quantity: 1,
  color: products[0].colors[0],
  size: products[0].sizes[1]
}, {
  id: products[1].id,
  product: products[1],
  quantity: 2,
  color: products[1].colors[1],
  size: products[1].sizes[2]
}];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  const subtotal = cartItems.reduce((total, item) => total + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount for demo
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === itemId ? {
      ...item,
      quantity: newQuantity
    } : item));
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'discount10') {
      setIsPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  return (
    <div className="animate-page-transition min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <ShoppingCart className="w-16 h-16 text-kutuku-primary opacity-80" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Button size="lg" asChild className="bg-kutuku-primary hover:bg-kutuku-secondary">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-4 md:p-6">
                      <CardTitle className="text-lg font-medium text-gray-800">Items in Your Cart ({cartItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                          <li key={`${item.id}-${item.size}-${item.color}`} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 transition-colors hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <Link to={`/product/${item.id}`}>
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="w-20 h-20 object-cover rounded-md shadow-sm" 
                                />
                              </Link>
                            </div>
                            
                            <div className="flex-grow">
                              <Link to={`/product/${item.id}`} className="font-medium text-gray-800 hover:text-kutuku-primary transition-colors">
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs">
                                  Size: {item.size}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs">
                                  Color: {item.color}
                                </span>
                              </div>
                              <div className="mt-2">
                                {item.product.salePrice ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-kutuku-primary">₹{item.product.salePrice.toFixed(2)}</span>
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₹{item.product.price.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-medium">₹{item.product.price.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-3 sm:mt-0">
                              <div className="flex items-center border rounded-full overflow-hidden bg-white shadow-sm">
                                <button 
                                  type="button" 
                                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                  <span className="sr-only">Decrease quantity</span>
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button 
                                  type="button" 
                                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                  <span className="sr-only">Increase quantity</span>
                                </button>
                              </div>
                              
                              <span className="font-medium text-gray-800 min-w-20 text-right">
                                ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                              </span>
                              
                              <button 
                                type="button" 
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Remove item</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-4 md:p-6 bg-gray-50 flex justify-between">
                      <Button variant="outline" asChild>
                        <Link to="/">
                          Continue Shopping
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className={`transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Card className="border-none shadow-md overflow-hidden sticky top-24">
                  <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-4 md:p-6">
                    <CardTitle className="text-lg font-medium text-gray-800">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {isPromoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount (10%)</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {shipping > 0 ? `₹${shipping.toFixed(2)}` : 'Free'}
                        </span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-lg text-kutuku-primary">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-6">
                      <label htmlFor="promo-code" className="block text-sm font-medium mb-2">
                        Promo Code
                      </label>
                      <div className="flex">
                        <Input 
                          id="promo-code" 
                          value={promoCode} 
                          onChange={e => setPromoCode(e.target.value)} 
                          placeholder="Enter code" 
                          className="rounded-r-none focus-visible:ring-kutuku-primary" 
                          disabled={isPromoApplied} 
                        />
                        <Button 
                          variant={isPromoApplied ? "secondary" : "default"} 
                          className={`rounded-l-none ${!isPromoApplied ? "bg-kutuku-primary hover:bg-kutuku-secondary" : ""}`}
                          onClick={applyPromoCode} 
                          disabled={isPromoApplied || !promoCode}
                        >
                          {isPromoApplied ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-sm text-green-600 mt-2">
                          "DISCOUNT10" applied successfully!
                        </p>
                      )}
                      {!isPromoApplied && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Try "DISCOUNT10" for 10% off your order
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mb-4 bg-kutuku-primary hover:bg-kutuku-secondary" 
                      size="lg" 
                      asChild
                    >
                      <Link to="/checkout" className="flex items-center justify-center">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {cartItems.length > 0 && isMobile && (
        <CartToCheckout
          total={total}
          itemCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Cart;
