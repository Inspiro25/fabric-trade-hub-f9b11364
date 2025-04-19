import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatCurrency } from '@/lib/utils';

interface OrderSummaryProps {
  subtotal: number;
  isLoaded: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, isLoaded }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const { isDarkMode } = useTheme();
  
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
      <Card className={cn(
        "border rounded-xl overflow-hidden sticky top-20",
        isDarkMode 
          ? "bg-gray-800 shadow-lg shadow-black/20 border-gray-700" 
          : "bg-white shadow-sm border-gray-200"
      )}>
        <CardHeader className={cn(
          "border-b p-3",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-gray-50 border-gray-100"
        )}>
          <CardTitle className={cn(
            "text-sm md:text-base font-medium",
            isDarkMode ? "text-gray-100" : "text-gray-800"
          )}>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className={cn(
          "p-4 space-y-4",
          isDarkMode ? "bg-gray-800" : ""
        )}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>Subtotal</span>
              <span className={cn(
                "font-medium",
                isDarkMode ? "text-gray-200" : ""
              )}>{formatCurrency(subtotal)}</span>
            </div>
            
            {isPromoApplied && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-1">
                  <BadgePercent className="w-3 h-3" />
                  Discount (10%)
                </span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>Shipping</span>
              <span className={cn(
                "font-medium",
                isDarkMode ? "text-gray-200" : ""
              )}>
                {shipping > 0 ? formatCurrency(shipping) : 'Free'}
              </span>
            </div>
            
            <div className={cn(
              "border-t border-dashed pt-2 mt-2 flex justify-between",
              isDarkMode ? "border-gray-700" : "border-gray-200"
            )}>
              <span className={cn(
                "font-medium",
                isDarkMode ? "text-gray-200" : ""
              )}>Total</span>
              <span className={cn(
                "font-bold",
                isDarkMode ? "text-blue-400" : "text-blue-600"
              )}>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className={cn(
            "p-3 rounded-lg",
            isDarkMode 
              ? "bg-gray-700/50" 
              : "bg-blue-50"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <BadgePercent className={cn(
                "w-4 h-4",
                isDarkMode ? "text-blue-400" : "text-blue-600"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-200" : "text-gray-800"
              )}>Apply Promo Code</span>
            </div>
            <div className="flex">
              <Input 
                value={promoCode} 
                onChange={e => setPromoCode(e.target.value)} 
                placeholder="Enter code" 
                className={cn(
                  "rounded-r-none h-8 text-xs",
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-200 focus-visible:ring-blue-500" 
                    : "focus-visible:ring-blue-500 border-gray-200"
                )} 
                disabled={isPromoApplied} 
              />
              <Button 
                variant={isPromoApplied ? "secondary" : "default"} 
                className={cn(
                  "rounded-l-none h-8 text-xs",
                  isPromoApplied
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
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
              <p className={cn(
                "text-xs mt-1",
                isDarkMode ? "text-gray-400" : "text-muted-foreground"
              )}>
                Try "DISCOUNT10" for 10% off your order
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className={cn(
              "flex items-center gap-2 text-xs",
              isDarkMode ? "text-gray-400" : "text-muted-foreground"
            )}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure checkout with payment protection</span>
            </div>
            
            <Button 
              className={cn(
                "w-full rounded-full text-white",
                isDarkMode 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              )} 
              size="sm"
              asChild
            >
              <Link to="/checkout" className="flex items-center justify-center">
                Proceed to Checkout
                <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
