
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Phone, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayResponse } from '@/lib/razorpay';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Checkout = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [cart] = useState({
    items: [
      { id: 'p1', name: 'Premium Cotton T-Shirt', quantity: 2, price: 29.99 },
      { id: 'p2', name: 'Slim Fit Denim Jeans', quantity: 1, price: 59.99 }
    ],
    subtotal: 119.97,
    shipping: 4.99,
    tax: 12.50,
    total: 137.46
  });
  
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
  
  const handlePaymentSuccess = (response: RazorpayResponse) => {
    toast.success("Order Placed Successfully!");
    
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderId: response.razorpay_payment_id,
          customerInfo,
          cart
        } 
      });
    }, 1000);
  };
  
  const initiateRazorpayPayment = () => {
    import('@/lib/razorpay').then(({ initializeRazorpay }) => {
      initializeRazorpay({
        amount: cart.total * 100, 
        currency: 'INR',
        name: 'Fashion Store',
        description: 'Payment for your order',
        image: '/logo.png',
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: '#7E69AB', // Updated to purple theme
        },
        handler: (response) => {
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      });
    });
  };
  
  return (
    <div className="animate-page-transition bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-2 max-w-6xl pt-3 pb-2">
        <Link to="/cart" className="inline-flex items-center text-xs text-gray-600 hover:text-purple-500 mb-2">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to cart
        </Link>
        
        <Card className="border-none shadow-lg overflow-hidden">
          {/* Header with steps */}
          <CardHeader className="bg-gradient-to-r from-[#E5DEFF] to-[#D6BCFA] p-3 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-gray-800">
              {paymentStep ? 'Complete Your Purchase' : 'Checkout'}
            </CardTitle>
            
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex items-center ${paymentStep ? 'text-green-600' : 'text-purple-700 font-medium'}`}>
                {paymentStep ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                Shipping
              </span>
              <span className="text-gray-400 mx-1">→</span>
              <span className={`${paymentStep ? 'text-purple-700 font-medium' : 'text-gray-400'}`}>
                Payment
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Left column - Condensed Billing Form */}
              <div className="flex-1 p-3">
                {!paymentStep ? (
                  <>
                    <div className="bg-purple-50 p-2 rounded-lg mb-3">
                      <h2 className="text-xs font-semibold flex items-center gap-1 text-purple-700 mb-2">
                        <User className="h-3 w-3" /> Billing Information
                      </h2>
                      <form className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-[10px] font-medium text-gray-700">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={customerInfo.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="h-7 text-xs bg-white rounded-md"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="email" className="text-[10px] font-medium text-gray-700">Email</Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email"
                              value={customerInfo.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="h-7 text-xs bg-white rounded-md"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-[10px] font-medium text-gray-700">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className="h-7 text-xs bg-white rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="address" className="text-[10px] font-medium text-gray-700">Street Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St, Apartment 4B"
                            className="h-7 text-xs bg-white rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="city" className="text-[10px] font-medium text-gray-700">City</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={customerInfo.city}
                              onChange={handleInputChange}
                              placeholder="Mumbai"
                              className="h-7 text-xs bg-white rounded-md"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="state" className="text-[10px] font-medium text-gray-700">State</Label>
                            <Input 
                              id="state" 
                              name="state" 
                              value={customerInfo.state}
                              onChange={handleInputChange}
                              placeholder="Maharashtra"
                              className="h-7 text-xs bg-white rounded-md"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="pincode" className="text-[10px] font-medium text-gray-700">PIN Code</Label>
                            <Input 
                              id="pincode" 
                              name="pincode" 
                              value={customerInfo.pincode}
                              onChange={handleInputChange}
                              placeholder="400001"
                              className="h-7 text-xs bg-white rounded-md"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-100 rounded-md overflow-hidden mb-2">
                      <div className="bg-purple-100 p-2">
                        <h3 className="text-xs font-medium text-purple-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Billing Address
                        </h3>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] text-gray-600">
                          {customerInfo.name}<br />
                          {customerInfo.address}<br />
                          {customerInfo.city}, {customerInfo.state} {customerInfo.pincode}<br />
                          {customerInfo.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <CreditCard className="h-3 w-3" /> Choose Payment Method
                      </h3>
                      <Card 
                        className="border border-purple-200 p-2 flex items-center gap-2 cursor-pointer hover:bg-purple-50 transition-colors"
                        onClick={initiateRazorpayPayment}
                      >
                        <div className="flex-shrink-0">
                          <img src="https://cdn.razorpay.com/static/assets/logo/payment-method.svg" alt="Razorpay" className="h-5" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-[11px] font-medium">Razorpay</p>
                          <p className="text-[10px] text-gray-500">Pay securely via Razorpay</p>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="pt-1">
                      <Button 
                        type="button"
                        className="w-full h-8 text-xs bg-purple-600 hover:bg-purple-700 rounded-md"
                        onClick={initiateRazorpayPayment}
                      >
                        Pay ₹{cart.total.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Order Summary */}
              <div className="w-full md:w-[280px] p-3 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100">
                <h2 className="font-medium text-xs mb-2 text-purple-800">Order Summary</h2>
                <Card className="bg-white border-none shadow-sm p-2 mb-2">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-gray-600 truncate flex-1">{item.name} (x{item.quantity})</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </Card>
                
                <div className="space-y-1.5 text-[11px] bg-white p-2.5 rounded-md shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cart.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{cart.shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{cart.tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-1.5" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">₹{cart.total.toFixed(2)}</span>
                  </div>
                  
                  {!paymentStep && (
                    <div className="pt-2">
                      <Button 
                        type="button"
                        onClick={handleContinueToPayment}
                        className="w-full h-8 text-xs bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Order Security Details */}
                <div className="mt-2 bg-white p-2 rounded-md shadow-sm">
                  <h3 className="text-[11px] font-medium mb-1.5">Order Protection</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-1.5">
                      <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2 w-2 text-green-600" />
                      </div>
                      <p className="text-[10px] text-gray-600">Secure 256-bit SSL encryption</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2 w-2 text-green-600" />
                      </div>
                      <p className="text-[10px] text-gray-600">Data privacy protection</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2 w-2 text-green-600" />
                      </div>
                      <p className="text-[10px] text-gray-600">100% money-back guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Checkout;
