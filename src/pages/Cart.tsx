
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Product, mockProducts } from '@/lib/products';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/contexts/WishlistContext';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import CartToCheckout from '@/components/features/CartToCheckout';
import ProductCard from '@/components/ui/ProductCard';

// Mock cart items for demonstration
const initialCartItems = [
  {
    id: mockProducts[0].id,
    product: mockProducts[0],
    quantity: 1,
    color: mockProducts[0].colors[0],
    size: mockProducts[0].sizes[1]
  }, 
  {
    id: mockProducts[1].id,
    product: mockProducts[1],
    quantity: 2,
    color: mockProducts[1].colors[1],
    size: mockProducts[1].sizes[2]
  },
  {
    id: mockProducts[2].id,
    product: mockProducts[2],
    quantity: 1,
    color: mockProducts[2].colors[0],
    size: mockProducts[2].sizes[0]
  },
  {
    id: mockProducts[3].id,
    product: mockProducts[3],
    quantity: 3,
    color: mockProducts[3].colors[1],
    size: mockProducts[3].sizes[1]
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  
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

  // Load wishlist products
  useEffect(() => {
    // Filter mockProducts based on wishlist IDs
    const productsInWishlist = mockProducts.filter(product => 
      wishlist.includes(product.id)
    );
    setWishlistProducts(productsInWishlist);
  }, [wishlist]);

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

  const handleMoveToCart = (product: Product) => {
    // Check if product already in cart
    const isInCart = cartItems.some(item => item.id === product.id);
    
    if (!isInCart) {
      // Add to cart with default first color and size
      const newItem = {
        id: product.id,
        product: product,
        quantity: 1,
        color: product.colors[0],
        size: product.sizes[0]
      };
      
      setCartItems(prev => [...prev, newItem]);
      removeFromWishlist(product.id);
      toast.success(`${product.name} moved to cart`);
    } else {
      toast.info(`${product.name} is already in your cart`);
    }
  };

  return (
    <div className="animate-page-transition min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-16 pb-20">
        <div className="container mx-auto px-2 max-w-7xl">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-4">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-kutuku-primary opacity-80" />
              </div>
              <h2 className="text-lg font-semibold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 text-sm">Looks like you haven't added anything to your cart yet.</p>
              <Button size="default" asChild className="bg-kutuku-primary hover:bg-kutuku-secondary">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
                      <CardTitle className="text-base font-medium text-gray-800">Items in Your Cart ({cartItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                          <li key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <Link to={`/product/${item.id}`}>
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="w-14 h-14 object-cover rounded-md shadow-sm" 
                                />
                              </Link>
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <Link to={`/product/${item.id}`} className="font-medium text-sm text-gray-800 hover:text-kutuku-primary transition-colors truncate block">
                                {item.product.name}
                              </Link>
                              <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">
                                  {item.size}
                                </span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">
                                  {item.color}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-full overflow-hidden bg-white shadow-sm h-6">
                                <button 
                                  type="button" 
                                  className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                  <span className="sr-only">Decrease quantity</span>
                                </button>
                                <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                                <button 
                                  type="button" 
                                  className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                  <span className="sr-only">Increase quantity</span>
                                </button>
                              </div>
                              
                              <span className="font-medium text-gray-800 text-xs min-w-14 text-right">
                                ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                              </span>
                              
                              <button 
                                type="button" 
                                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <X className="w-3 h-3" />
                                <span className="sr-only">Remove item</span>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-3 bg-gray-50 flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/">
                          Continue Shopping
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Wishlist Section */}
                <div className={`transition-all duration-500 delay-150 mt-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
                      <CardTitle className="text-base font-medium text-gray-800 flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-500" />
                        Your Wishlist ({wishlistProducts.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      {wishlistProducts.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {wishlistProducts.map((product) => (
                            <div key={product.id} className="relative group">
                              <ProductCard product={product} variant="compact" />
                              <Button 
                                size="sm" 
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs bg-kutuku-primary hover:bg-kutuku-secondary"
                                onClick={() => handleMoveToCart(product)}
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className={`transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Card className="border-none shadow-md overflow-hidden sticky top-20">
                  <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
                    <CardTitle className="text-base font-medium text-gray-800">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2 mb-4 text-sm">
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
                      
                      <div className="border-t border-dashed border-gray-200 pt-2 mt-2 flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-kutuku-primary">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-4">
                      <label htmlFor="promo-code" className="block text-xs font-medium mb-1">
                        Promo Code
                      </label>
                      <div className="flex">
                        <Input 
                          id="promo-code" 
                          value={promoCode} 
                          onChange={e => setPromoCode(e.target.value)} 
                          placeholder="Enter code" 
                          className="rounded-r-none h-8 text-xs focus-visible:ring-kutuku-primary" 
                          disabled={isPromoApplied} 
                        />
                        <Button 
                          variant={isPromoApplied ? "secondary" : "default"} 
                          className={`rounded-l-none h-8 text-xs ${!isPromoApplied ? "bg-kutuku-primary hover:bg-kutuku-secondary" : ""}`}
                          onClick={applyPromoCode} 
                          disabled={isPromoApplied || !promoCode}
                        >
                          {isPromoApplied ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-xs text-green-600 mt-1">
                          "DISCOUNT10" applied successfully!
                        </p>
                      )}
                      {!isPromoApplied && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Try "DISCOUNT10" for 10% off your order
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full mb-2 bg-kutuku-primary hover:bg-kutuku-secondary" 
                      size="sm"
                      asChild
                    >
                      <Link to="/checkout" className="flex items-center justify-center">
                        Proceed to Checkout
                        <ArrowRight className="ml-1 w-3 h-3" />
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
