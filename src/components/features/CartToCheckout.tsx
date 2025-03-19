
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface CartToCheckoutProps {
  total: number;
  itemCount: number;
  className?: string;
}

const CartToCheckout = ({ total, itemCount, className = '' }: CartToCheckoutProps) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t p-4 md:p-6 ${className}`}>
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-medium flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
        </div>
        
        <Button size="lg" asChild>
          <Link to="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
