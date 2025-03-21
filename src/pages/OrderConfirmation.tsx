
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  
  // Redirect if no order data is available
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);
  
  // Early return if no order data
  if (!orderData) {
    return null;
  }
  
  const { orderId, customerInfo, cart } = orderData;
  
  // Generate a fake tracking number
  const trackingNumber = `KTK${Math.floor(100000 + Math.random() * 900000)}IN`;
  
  return (
    <div className="animate-page-transition bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 max-w-3xl py-6 md:py-10">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-5 text-center">
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-xl font-medium text-gray-800 mb-1">Order Confirmed!</h1>
            <p className="text-sm text-gray-600">Thank you for your purchase</p>
          </div>
          
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h2 className="text-sm font-medium">Order Details</h2>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-medium">{orderId.substring(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking Number:</span>
                    <span className="font-medium">{trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span>Razorpay</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-sm font-medium">Shipping Information</h2>
                <div className="text-xs text-gray-600">
                  <p className="font-medium">{customerInfo.name}</p>
                  <p>{customerInfo.address}</p>
                  <p>{customerInfo.city}, {customerInfo.state} {customerInfo.pincode}</p>
                  <p>{customerInfo.phone}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h2 className="text-sm font-medium">Order Summary</h2>
              <div className="space-y-2 text-xs">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator className="my-2" />
                
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
                
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span className="text-kutuku-primary">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100 flex items-center gap-3 text-sm">
              <Package className="h-5 w-5 text-kutuku-primary" />
              <div>
                <p className="font-medium">Your order will be shipped soon!</p>
                <p className="text-xs text-gray-500">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/orders">View My Orders</Link>
              </Button>
              <Button asChild className="flex-1 bg-kutuku-primary hover:bg-kutuku-secondary">
                <Link to="/" className="flex items-center justify-center">
                  Continue Shopping
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
