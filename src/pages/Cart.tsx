
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X, ShoppingCart, ChevronRight, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/lib/products';

// Mock cart items for demonstration
const initialCartItems = [
  {
    id: products[0].id,
    product: products[0],
    quantity: 1,
    color: products[0].colors[0],
    size: products[0].sizes[1],
  },
  {
    id: products[1].id,
    product: products[1],
    quantity: 2,
    color: products[1].colors[1],
    size: products[1].sizes[2],
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  
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
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
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
    <div className="animate-page-transition">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="heading-lg mb-8 text-center">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="heading-md mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Button size="lg" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div 
                  className={`transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="font-medium">Product</h2>
                    <div className="flex items-center">
                      <span className="w-24 text-center">Quantity</span>
                      <span className="w-24 text-right">Total</span>
                      <span className="w-10"></span>
                    </div>
                  </div>
                  
                  <ul className="divide-y divide-border">
                    {cartItems.map((item, index) => (
                      <li 
                        key={`${item.id}-${item.size}-${item.color}`} 
                        className="py-6 flex flex-col sm:flex-row sm:items-center gap-4"
                      >
                        <div className="flex-shrink-0">
                          <Link to={`/product/${item.id}`}>
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          </Link>
                        </div>
                        
                        <div className="flex-grow">
                          <Link 
                            to={`/product/${item.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span>Size: {item.size}</span>
                            <span className="mx-2">•</span>
                            <span>Color: {item.color}</span>
                          </div>
                          <div className="mt-1">
                            {item.product.salePrice ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">${item.product.salePrice.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium">${item.product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center ml-auto">
                          <div className="flex items-center border rounded-md mr-4">
                            <button 
                              type="button"
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              type="button"
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                              <span className="sr-only">Increase quantity</span>
                            </button>
                          </div>
                          
                          <span className="w-24 text-right font-medium">
                            ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                          
                          <button 
                            type="button"
                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Remove item</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Summary */}
              <div 
                className={`transition-all duration-500 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-muted/30 rounded-lg p-6 border border-border">
                  <h2 className="font-medium text-lg mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {isPromoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <label htmlFor="promo-code" className="block text-sm mb-2">
                      Promo Code
                    </label>
                    <div className="flex">
                      <Input
                        id="promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="rounded-r-none"
                        disabled={isPromoApplied}
                      />
                      <Button 
                        variant={isPromoApplied ? "secondary" : "default"}
                        className="rounded-l-none"
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
                  
                  <Button className="w-full mb-4" size="lg" asChild>
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
