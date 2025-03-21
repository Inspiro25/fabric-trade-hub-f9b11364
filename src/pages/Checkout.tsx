
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayResponse } from '@/lib/razorpay';
import { useIsMobile } from '@/hooks/use-mobile';

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
          color: '#3B82F6',
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
      
      <main className="container mx-auto px-2 max-w-3xl pt-5 pb-2">
        <Link to="/cart" className="inline-flex items-center text-xs text-gray-600 hover:text-kutuku-primary mb-3">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to cart
        </Link>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header with steps */}
          <div className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-2 flex justify-between items-center">
            <h1 className="text-sm font-medium text-gray-800">
              {paymentStep ? 'Payment' : 'Shipping Information'}
            </h1>
            
            <div className="flex items-center gap-1 text-xs">
              <span className={`flex items-center ${paymentStep ? 'text-green-600' : 'text-kutuku-primary font-medium'}`}>
                {paymentStep ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                Shipping
              </span>
              <span className="text-gray-400 mx-1">→</span>
              <span className={`${paymentStep ? 'text-kutuku-primary font-medium' : 'text-gray-400'}`}>
                Payment
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left column - Form */}
            <div className="flex-1 p-3">
              {!paymentStep ? (
                <form onSubmit={handleContinueToPayment} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="name" className="text-xs">Full Name*</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="h-7 text-xs mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-xs">Email*</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="h-7 text-xs mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone Number*</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="h-7 text-xs mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-xs">Address*</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, Apartment 4B"
                      className="h-7 text-xs mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="city" className="text-xs">City*</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="h-7 text-xs mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs">State*</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={customerInfo.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="h-7 text-xs mt-1"
                        required
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Label htmlFor="pincode" className="text-xs">PIN Code*</Label>
                      <Input 
                        id="pincode" 
                        name="pincode" 
                        value={customerInfo.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="h-7 text-xs mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit"
                      className="w-full h-8 text-xs bg-kutuku-primary hover:bg-kutuku-secondary"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                    <h3 className="text-xs font-medium mb-1">Shipping Address</h3>
                    <p className="text-xs text-gray-500">
                      {customerInfo.name}<br />
                      {customerInfo.address}<br />
                      {customerInfo.city}, {customerInfo.state} {customerInfo.pincode}<br />
                      {customerInfo.phone}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium mb-1">Payment Method</h3>
                    <div 
                      className="border rounded-md p-2 flex items-center gap-2 cursor-pointer bg-gray-50"
                      onClick={initiateRazorpayPayment}
                    >
                      <div className="flex-shrink-0">
                        <img src="https://cdn.razorpay.com/static/assets/logo/payment-method.svg" alt="Razorpay" className="h-6" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-medium">Razorpay</p>
                        <p className="text-xs text-gray-500">Pay securely via Razorpay</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="button"
                      className="w-full h-8 text-xs bg-kutuku-primary hover:bg-kutuku-secondary"
                      onClick={initiateRazorpayPayment}
                    >
                      Pay ₹{cart.total.toFixed(2)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Order Summary */}
            <div className="w-full md:w-5/12 p-3 bg-gray-50 border-t md:border-t-0 md:border-l">
              <h2 className="font-medium text-xs mb-2">Order Summary</h2>
              <div className="space-y-1 text-xs">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600 truncate">{item.name} (x{item.quantity})</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator className="my-1" />
                
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
                
                <div className="flex justify-between text-xs font-bold mt-1 pt-1 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span className="text-kutuku-primary">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-3 w-3 text-gray-400" />
                  <span>Delivery in 3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
