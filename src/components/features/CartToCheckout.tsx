
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
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-2 z-40 ${className}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="bg-kutuku-light p-1.5 rounded-full">
            <ShoppingBag className="h-3 w-3 text-kutuku-primary" />
          </div>
          <div>
            <p className="text-xs text-gray-600 leading-none">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-sm font-bold text-kutuku-primary">₹{total.toFixed(2)}</p>
          </div>
        </div>
        
        <Button 
          size="sm"
          className="bg-kutuku-primary hover:bg-kutuku-secondary text-xs px-3 py-1 h-8"
          asChild
        >
          <Link to="/checkout" className="flex items-center justify-center">
            Checkout
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
