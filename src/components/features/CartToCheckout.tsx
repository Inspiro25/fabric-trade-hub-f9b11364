
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CartToCheckoutProps {
  total: number;
  itemCount: number;
  className?: string;
}

const CartToCheckout = ({ total, itemCount, className = '' }: CartToCheckoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t p-4 z-40 ${className}`}>
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-medium flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
        </div>
        
        <Button 
          size={isMobile ? "default" : "lg"} 
          className={isMobile ? "w-full bg-orange-500 hover:bg-orange-600" : ""}
          asChild
        >
          <Link to="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CartToCheckout;
