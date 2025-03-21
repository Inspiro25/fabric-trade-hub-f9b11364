
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface OrderSummaryProps {
  subtotal: number;
  isLoaded: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, isLoaded }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  
  const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount for demo
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'discount10') {
      setIsPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  return (
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
  );
};

export default OrderSummary;
