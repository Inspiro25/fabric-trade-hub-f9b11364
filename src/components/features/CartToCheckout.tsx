
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CartToCheckoutProps {
  total: number;
  itemCount: number;
  className?: string;
}

const CartToCheckout = ({ total, itemCount, className = '' }: CartToCheckoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 z-40 ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-kutuku-light p-2 rounded-full">
            <ShoppingBag className="h-4 w-4 text-kutuku-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-600 leading-tight">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-sm font-bold text-kutuku-primary leading-tight">₹{total.toFixed(2)}</p>
          </div>
        </div>
        
        <Button 
          className="bg-kutuku-primary hover:bg-kutuku-secondary text-xs px-4 py-2 h-10 rounded-full"
          asChild
        >
          <Link to="/checkout" className="flex items-center justify-center gap-1">
            Checkout
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
