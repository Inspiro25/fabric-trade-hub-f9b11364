import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Package, 
  ArrowRight, 
  Truck, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);
  
  if (!orderData) {
    return null;
  }
  
  const { orderId, customerInfo, cart } = orderData;
  const trackingNumber = `KTK${Math.floor(100000 + Math.random() * 900000)}IN`;
  
  return (
    <div className={cn(
      "min-h-screen pb-24",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="container mx-auto px-4 max-w-3xl py-6 md:py-10">
        <Card className={cn(
          "overflow-hidden",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        )}>
          {/* Success Banner */}
          <div className={cn(
            "p-8 text-center relative overflow-hidden",
            isDarkMode 
              ? "bg-gradient-to-r from-gray-800 to-gray-700" 
              : "bg-gradient-to-r from-orange-50 to-orange-100"
          )}>
            {/* Success Icon */}
            <div className={cn(
              "inline-flex justify-center items-center w-16 h-16 rounded-full mb-4",
              isDarkMode 
                ? "bg-green-900/50 text-green-400" 
                : "bg-green-100 text-green-600"
            )}>
              <CheckCircle className="h-8 w-8" />
            </div>
            
            <h1 className={cn(
              "text-2xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Order Confirmed!
            </h1>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Thank you for shopping with us
            </p>

            {/* Decorative circles */}
            <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-orange-200/10" />
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-orange-200/10" />
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Order Status */}
            <div className={cn(
              "p-4 rounded-lg",
              isDarkMode ? "bg-gray-900/50" : "bg-orange-50"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-full",
                  isDarkMode ? "bg-gray-800" : "bg-white"
                )}>
                  <Package className={cn(
                    "h-5 w-5",
                    isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                  )} />
                </div>
                <div>
                  <h3 className={cn(
                    "font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    Order Processing
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Your order will be shipped soon
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <h3 className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Order Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>Order Date</p>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{format(new Date(), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>Order ID</p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{orderId.substring(0, 12)}...</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>Tracking Number</p>
                      <p className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{trackingNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>Payment Method</p>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{customerInfo.name}</p>
                      <p className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        {customerInfo.address}<br />
                        {customerInfo.city}, {customerInfo.state} {customerInfo.pincode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}>{customerInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className={cn(
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />

            {/* Order Summary */}
            <div className="space-y-4">
              <h3 className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Order Summary
              </h3>
              
              <div className="space-y-3">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      )}
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>{item.name}</p>
                        <p className={cn(
                          "text-xs",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className={cn(
                "p-4 rounded-lg space-y-2",
                isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
              )}>
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Shipping</span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>₹{cart.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Tax</span>
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>₹{cart.tax.toFixed(2)}</span>
                </div>
                <Separator className={cn(
                  "my-2",
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                )} />
                <div className="flex justify-between text-sm font-medium">
                  <span className={isDarkMode ? "text-white" : "text-gray-900"}>Total</span>
                  <span className={cn(
                    isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                  )}>₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-4",
              isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
            )}>
              <div className={cn(
                "p-2 rounded-full",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <Clock className={cn(
                  "h-5 w-5",
                  isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                )} />
              </div>
              <div>
                <p className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Estimated Delivery
                </p>
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  {format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'MMM dd')} - {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                asChild 
                variant="outline"
                className={cn(
                  "flex-1",
                  isDarkMode && "border-gray-700 hover:bg-gray-800"
                )}
              >
                <Link to="/account/orders">View My Orders</Link>
              </Button>
              <Button 
                asChild 
                className={cn(
                  "flex-1",
                  isDarkMode 
                    ? "bg-orange-600 hover:bg-orange-700" 
                    : "bg-kutuku-primary hover:bg-kutuku-secondary"
                )}
              >
                <Link to="/" className="flex items-center justify-center">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
