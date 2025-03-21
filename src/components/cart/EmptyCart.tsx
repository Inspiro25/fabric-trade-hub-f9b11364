
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyCart: React.FC = () => {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <ShoppingCart className="w-12 h-12 text-kutuku-primary opacity-80" />
      </div>
      <h2 className="text-lg font-semibold mb-3">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button size="default" asChild className="bg-kutuku-primary hover:bg-kutuku-secondary">
        <Link to="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
