
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentButton from '@/components/features/PaymentButton';
import { toast } from '@/components/ui/use-toast';
import { RazorpayResponse } from '@/lib/razorpay';

const Checkout = () => {
  const navigate = useNavigate();
  
  // Mock cart data - In a real app, this would come from a cart context/store
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentSuccess = (response: RazorpayResponse) => {
    toast({
      title: "Order Placed Successfully!",
      description: "Your order has been confirmed and will be shipped soon.",
    });
    
    // In a real app, you would save the order to your backend here
    
    // Navigate to a success page or order history
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="animate-page-transition">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-10">
        <h1 className="heading-lg mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Apartment 4B"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input 
                      id="pincode" 
                      name="pincode" 
                      value={customerInfo.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="razorpay">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
                    <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="razorpay" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pay securely with Razorpay. Credit/Debit cards, Net Banking, and more payment options available.
                    </p>
                    <div className="flex gap-2">
                      <img src="https://cdn.razorpay.com/static/assets/logo/cards/visa.svg" alt="Visa" className="h-6" />
                      <img src="https://cdn.razorpay.com/static/assets/logo/cards/mastercard.svg" alt="Mastercard" className="h-6" />
                      <img src="https://cdn.razorpay.com/static/assets/logo/cards/rupay.svg" alt="RuPay" className="h-6" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cod">
                    <p className="text-sm text-muted-foreground">
                      Pay at the time of delivery. Additional charges may apply.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="upi">
                    <p className="text-sm text-muted-foreground">
                      Pay using your favorite UPI app (Google Pay, PhonePe, Paytm, etc.)
                    </p>
                    <div className="flex gap-2 mt-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/PhonePe_logo.svg/120px-PhonePe_logo.svg.png" alt="PhonePe" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/120px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>₹{cart.subtotal.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>₹{cart.shipping.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Tax</p>
                    <p>₹{cart.tax.toFixed(2)}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>₹{cart.total.toFixed(2)}</p>
                  </div>
                  
                  <PaymentButton 
                    amount={cart.total}
                    onSuccess={handlePaymentSuccess}
                    customerInfo={{
                      name: customerInfo.name,
                      email: customerInfo.email,
                      phone: customerInfo.phone
                    }}
                    className="w-full mt-4"
                  />
                  
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
