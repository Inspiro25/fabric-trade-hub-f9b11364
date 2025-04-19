import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface CartToCheckoutProps {
  total: number;
  itemCount: number;
  className?: string;
}

const CartToCheckout = ({ total, itemCount, className = '' }: CartToCheckoutProps) => {
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 border-t p-3 z-40",
      isDarkMode 
        ? "bg-gray-900 border-gray-800 shadow-lg shadow-black/20" 
        : "bg-white shadow-lg border-gray-200",
      className
    )}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            isDarkMode ? "bg-gray-800" : "bg-blue-50"
          )}>
            <ShoppingBag className={cn(
              "h-4 w-4",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )} />
          </div>
          <div>
            <p className={cn(
              "text-xs leading-tight",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className={cn(
              "text-sm font-bold leading-tight",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>₹{total.toFixed(2)}</p>
          </div>
        </div>
        
        <Button 
          className={cn(
            "text-xs px-4 py-2 h-10 rounded-full text-white",
            isDarkMode 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-blue-600 hover:bg-blue-700"
          )}
          asChild
        >
          <Link to="/checkout" className="flex items-center justify-center gap-1">
            Proceed to Checkout
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
