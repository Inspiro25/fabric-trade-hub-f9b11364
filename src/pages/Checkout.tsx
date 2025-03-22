
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
          color: '#FE7235', // Updated to kutuku orange
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
    <div className="animate-page-transition bg-orange-50 min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-2 max-w-6xl pt-4 pb-6">
        <Link to="/cart" className="inline-flex items-center text-xs text-gray-600 hover:text-kutuku-primary mb-3">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to cart
        </Link>
        
        <Card className="border-none shadow-lg overflow-hidden">
          {/* Header with steps */}
          <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200 p-3 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium text-kutuku-primary">
              {paymentStep ? 'Complete Your Purchase' : 'Checkout'}
            </CardTitle>
            
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex items-center ${paymentStep ? 'text-green-600' : 'text-kutuku-primary font-medium'}`}>
                {paymentStep ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                Shipping
              </span>
              <span className="text-gray-400 mx-1">→</span>
              <span className={`${paymentStep ? 'text-kutuku-primary font-medium' : 'text-gray-400'}`}>
                Payment
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Left column - Condensed Billing Form */}
              <div className="flex-1 p-4">
                {!paymentStep ? (
                  <>
                    <div className="bg-orange-50 p-3 rounded-lg mb-3 border border-orange-100">
                      <h2 className="text-sm font-semibold flex items-center gap-1 text-kutuku-primary mb-3">
                        <User className="h-4 w-4" /> Billing Information
                      </h2>
                      <form className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-xs font-medium text-gray-700">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={customerInfo.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-medium text-gray-700 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> Email
                            </Label>
                            <Input 
                              id="email" 
                              name="email" 
                              type="email"
                              value={customerInfo.email}
                              onChange={handleInputChange}
                              placeholder="john@example.com"
                              className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Phone Number
                          </Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="+91 9876543210"
                            className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="address" className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Street Address
                          </Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St, Apartment 4B"
                            className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="city" className="text-xs font-medium text-gray-700">City</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={customerInfo.city}
                              onChange={handleInputChange}
                              placeholder="Mumbai"
                              className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="state" className="text-xs font-medium text-gray-700">State</Label>
                            <Input 
                              id="state" 
                              name="state" 
                              value={customerInfo.state}
                              onChange={handleInputChange}
                              placeholder="Maharashtra"
                              className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                              required
                            />
                          </div>
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <Label htmlFor="pincode" className="text-xs font-medium text-gray-700">PIN Code</Label>
                            <Input 
                              id="pincode" 
                              name="pincode" 
                              value={customerInfo.pincode}
                              onChange={handleInputChange}
                              placeholder="400001"
                              className="h-9 text-sm bg-white rounded-md focus-visible:ring-kutuku-primary"
                              required
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-100 rounded-md overflow-hidden mb-2">
                      <div className="bg-orange-100 p-2">
                        <h3 className="text-sm font-medium text-kutuku-primary flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> Billing Address
                        </h3>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-600">
                          {customerInfo.name}<br />
                          {customerInfo.address}<br />
                          {customerInfo.city}, {customerInfo.state} {customerInfo.pincode}<br />
                          {customerInfo.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-kutuku-primary flex items-center gap-1">
                        <CreditCard className="h-4 w-4" /> Choose Payment Method
                      </h3>
                      <Card 
                        className="border border-orange-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-orange-50 transition-colors"
                        onClick={initiateRazorpayPayment}
                      >
                        <div className="flex-shrink-0">
                          <img src="https://cdn.razorpay.com/static/assets/logo/payment-method.svg" alt="Razorpay" className="h-6" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">Razorpay</p>
                          <p className="text-xs text-gray-500">Pay securely via Razorpay</p>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="button"
                        className="w-full h-10 text-sm bg-kutuku-primary hover:bg-kutuku-secondary rounded-full"
                        onClick={initiateRazorpayPayment}
                      >
                        Pay ₹{cart.total.toFixed(2)}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Order Summary */}
              <div className="w-full md:w-[320px] p-4 bg-orange-50 border-t md:border-t-0 md:border-l border-orange-100">
                <h2 className="font-medium text-base mb-3 text-kutuku-primary">Order Summary</h2>
                <Card className="bg-white border-none shadow-sm p-3 mb-3 rounded-xl">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 truncate flex-1">{item.name} (x{item.quantity})</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </Card>
                
                <div className="space-y-2 text-sm bg-white p-3 rounded-xl shadow-sm">
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
                  
                  <Separator className="my-2 bg-orange-100" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-kutuku-primary">₹{cart.total.toFixed(2)}</span>
                  </div>
                  
                  {!paymentStep && (
                    <div className="pt-3">
                      <Button 
                        type="button"
                        onClick={handleContinueToPayment}
                        className="w-full h-10 text-sm bg-kutuku-primary hover:bg-kutuku-secondary rounded-full transition-colors"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Order Security Details */}
                <div className="mt-3 bg-white p-3 rounded-xl shadow-sm">
                  <h3 className="text-sm font-medium mb-2 text-kutuku-primary">Order Protection</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Secure 256-bit SSL encryption</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Data privacy protection</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">100% money-back guarantee</p>
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
