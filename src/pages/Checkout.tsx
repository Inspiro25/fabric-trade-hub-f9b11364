import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayResponse } from '@/lib/razorpay';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/services/orderService';
import { useAuth } from '@/hooks/useAuth';

const Checkout = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { currentUser } = useAuth();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentStep, setPaymentStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate cart total
  const cartTotal = useMemo(() => getCartTotal(), [getCartTotal]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || 
        !customerInfo.address || !customerInfo.city || !customerInfo.state || !customerInfo.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setPaymentStep(true);
  };
  
  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    if (!currentUser?.uid) {
      toast.error("Please log in to complete your purchase");
      return;
    }

    setIsProcessing(true);
    try {
      // Format order items
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.sale_price || item.product.price,
        color: item.color,
        size: item.size
      }));

      // Create shipping address object
      const shippingAddress = {
        name: customerInfo.name,
        street: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.pincode,
        phone: customerInfo.phone
      };

      // Create the order
      const orderId = await createOrder(
        currentUser.uid,
        orderItems,
        shippingAddress,
        'razorpay',
        response.razorpay_payment_id,
        cartTotal
      );

      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Clear the cart
      await clearCart();

      // Navigate to success page
      navigate('/order-success', { 
        state: { 
          orderId,
          customerInfo,
          cart: {
            items: cartItems,
            total: cartTotal
          }
        } 
      });

      toast.success("Order placed successfully!");
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error("Error processing your order. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const initiateRazorpayPayment = () => {
    if (isProcessing) return;
    
    import('@/lib/razorpay').then(({ initializeRazorpay }) => {
      initializeRazorpay({
        amount: cartTotal * 100, 
        currency: 'INR',
        name: 'Vyoma',
        description: 'Payment for your order',
        image: '/logo.png',
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: isDarkMode ? '#FE7235' : '#FE7235',
        },
        handler: handlePaymentSuccess,
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      });
    });
  };
  
  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30"
    )}>
      <main className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/cart" className={cn(
            "inline-flex items-center text-sm",
            isDarkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-kutuku-primary"
          )}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to cart
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Billing Form */}
          <div className="lg:col-span-2">
            <Card className={cn(
              "border-none shadow-lg",
              isDarkMode ? "bg-gray-800" : "bg-white shadow-blue-100/50"
            )}>
              <CardContent className="p-6">
                {!paymentStep ? (
                  <>
                    <div className={cn(
                      "p-4 rounded-lg mb-4",
                      isDarkMode 
                        ? "bg-gray-800/50 border border-gray-700" 
                        : "bg-blue-50/80 border border-blue-100"
                    )}>
                      <h2 className={cn(
                        "text-lg font-semibold flex items-center gap-2 mb-4",
                        isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                      )}>
                        <User className="h-5 w-5" /> Billing Information
                      </h2>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={customerInfo.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className={cn(
                                "h-10 text-sm",
                                isDarkMode 
                                  ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                  : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                              )}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className={cn(
                              "text-sm font-medium flex items-center gap-1",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>
                              <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email"
                              value={customerInfo.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className={cn(
                                "h-10 text-sm",
                                isDarkMode 
                                  ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                  : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                              )}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className={cn(
                            "text-sm font-medium flex items-center gap-1",
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            <Phone className="h-4 w-4" /> Phone Number
                          </Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className={cn(
                              "h-10 text-sm",
                              isDarkMode 
                                ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                            )}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address" className={cn(
                            "text-sm font-medium flex items-center gap-1",
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          )}>
                            <MapPin className="h-4 w-4" /> Street Address
                          </Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St, Apartment 4B"
                            className={cn(
                              "h-10 text-sm",
                              isDarkMode 
                                ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                            )}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>City</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={customerInfo.city}
                              onChange={handleInputChange}
                              placeholder="Mumbai"
                              className={cn(
                                "h-10 text-sm",
                                isDarkMode 
                                  ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                  : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                              )}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state" className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>State</Label>
                            <Input 
                              id="state" 
                              name="state" 
                              value={customerInfo.state}
                              onChange={handleInputChange}
                              placeholder="Maharashtra"
                              className={cn(
                                "h-10 text-sm",
                                isDarkMode 
                                  ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                  : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                              )}
                              required
                            />
                          </div>
                          <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label htmlFor="pincode" className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            )}>PIN Code</Label>
                            <Input 
                              id="pincode" 
                              name="pincode" 
                              value={customerInfo.pincode}
                              onChange={handleInputChange}
                              placeholder="400001"
                              className={cn(
                                "h-10 text-sm",
                                isDarkMode 
                                  ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white" 
                                  : "bg-white border-gray-200 focus-visible:ring-kutuku-primary shadow-sm"
                              )}
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className={cn(
                      "text-lg font-semibold flex items-center gap-2 mb-4",
                      isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                    )}>
                      <CreditCard className="h-5 w-5" /> Payment Information
                    </h2>
                    
                    <div className={cn(
                      "rounded-lg overflow-hidden mb-4",
                      isDarkMode 
                        ? "bg-gray-800/50 border border-gray-700" 
                        : "bg-blue-50/80 border border-blue-100"
                    )}>
                      <div className={cn(
                        "p-3",
                        isDarkMode ? "bg-gray-700" : "bg-blue-100/80"
                      )}>
                        <h3 className={cn(
                          "text-sm font-medium flex items-center gap-1",
                          isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                        )}>
                          <MapPin className="h-4 w-4" /> Billing Address
                        </h3>
                      </div>
                      <div className="p-4">
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        )}>
                          {customerInfo.name}<br />
                          {customerInfo.address}<br />
                          {customerInfo.city}, {customerInfo.state} {customerInfo.pincode}<br />
                          {customerInfo.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Card 
                        className={cn(
                          "p-4 flex items-center gap-3 cursor-pointer transition-colors",
                          isDarkMode 
                            ? "border border-gray-700 hover:bg-gray-700" 
                            : "border border-blue-200 hover:bg-blue-50/80 shadow-sm"
                        )}
                        onClick={initiateRazorpayPayment}
                      >
                        <div className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#072654" className="w-6 h-6">
                            <path d="M8.584 18.368c-.995.58-2.39.58-3.38 0L.595 15.08a2.09 2.09 0 0 1-.594-2.95L7.41.59C8.005-.17 9.198-.18 9.802.58l8.41 11.66c.6.82.37 1.97-.494 2.53l-9.134 3.598Z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <p className={cn(
                            "text-sm font-medium",
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          )}>Razorpay</p>
                          <p className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>Pay securely via Razorpay</p>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button"
                        className={cn(
                          "w-full h-11 text-sm rounded-full",
                          isDarkMode 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-kutuku-primary hover:bg-kutuku-secondary shadow-md"
                        )}
                        onClick={initiateRazorpayPayment}
                      >
                        Pay ₹{cartTotal.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className={cn(
              "border-none shadow-lg sticky top-24",
              isDarkMode ? "bg-gray-800" : "bg-white shadow-blue-100/50"
            )}>
              <CardContent className="p-6">
                <h2 className={cn(
                  "text-lg font-semibold mb-4",
                  isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                )}>Order Summary</h2>
                
                <div className={cn(
                  "space-y-3 mb-4",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="truncate flex-1">{item.product.name} (x{item.quantity})</span>
                      <span className="font-medium">₹{(item.product.sale_price || item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className={cn(
                  "my-4",
                  isDarkMode ? "bg-gray-700" : "bg-blue-100"
                )} />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Subtotal</span>
                    <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Shipping</span>
                    <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>₹{4.99.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Tax</span>
                    <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>₹{(cartTotal * 0.18).toFixed(2)}</span>
                  </div>
                  
                  <Separator className={cn(
                    "my-2",
                    isDarkMode ? "bg-gray-700" : "bg-blue-100"
                  )} />
                  
                  <div className="flex justify-between font-bold">
                    <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>Total</span>
                    <span className={isDarkMode ? "text-blue-400" : "text-kutuku-primary"}>
                      ₹{(cartTotal + 4.99 + cartTotal * 0.18).toFixed(2)}
                    </span>
                  </div>
                  
                  {!paymentStep && (
                    <div className="pt-4">
                      <Button 
                        type="button"
                        onClick={handleContinueToPayment}
                        className={cn(
                          "w-full h-11 text-sm rounded-full",
                          isDarkMode 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-kutuku-primary hover:bg-kutuku-secondary shadow-md"
                        )}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Order Security Details */}
                <div className={cn(
                  "mt-6 p-4 rounded-lg",
                  isDarkMode ? "bg-gray-700/50" : "bg-blue-50/80"
                )}>
                  <h3 className={cn(
                    "text-sm font-medium mb-3",
                    isDarkMode ? "text-blue-400" : "text-kutuku-primary"
                  )}>Order Protection</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        isDarkMode ? "bg-green-900/40" : "bg-green-100"
                      )}>
                        <CheckCircle className={cn(
                          "h-2.5 w-2.5",
                          isDarkMode ? "text-green-400" : "text-green-600"
                        )} />
                      </div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>Secure 256-bit SSL encryption</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        isDarkMode ? "bg-green-900/40" : "bg-green-100"
                      )}>
                        <CheckCircle className={cn(
                          "h-2.5 w-2.5",
                          isDarkMode ? "text-green-400" : "text-green-600"
                        )} />
                      </div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>Data privacy protection</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        isDarkMode ? "bg-green-900/40" : "bg-green-100"
                      )}>
                        <CheckCircle className={cn(
                          "h-2.5 w-2.5",
                          isDarkMode ? "text-green-400" : "text-green-600"
                        )} />
                      </div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>100% money-back guarantee</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
