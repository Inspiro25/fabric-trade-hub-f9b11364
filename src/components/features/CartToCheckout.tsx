
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
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-40 ${className}`}>
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-kutuku-light p-2 rounded-full">
            <ShoppingBag className="h-4 w-4 text-kutuku-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-600 leading-none">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-lg font-bold text-kutuku-primary">₹{total.toFixed(2)}</p>
          </div>
        </div>
        
        <Button 
          size={isMobile ? "default" : "lg"} 
          className="w-full sm:w-auto bg-kutuku-primary hover:bg-kutuku-secondary"
          asChild
        >
          <Link to="/checkout" className="flex items-center justify-center">
            Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
