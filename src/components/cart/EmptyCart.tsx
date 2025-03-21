
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyCart: React.FC = () => {
  return (
    <div className="text-center py-10 bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
      <div className="inline-flex justify-center items-center p-3 bg-kutuku-light rounded-full mb-4">
        <ShoppingCart className="w-8 h-8 text-kutuku-primary" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-sm max-w-xs mx-auto">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button size="lg" asChild className="bg-kutuku-primary hover:bg-kutuku-secondary rounded-full">
        <Link to="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
