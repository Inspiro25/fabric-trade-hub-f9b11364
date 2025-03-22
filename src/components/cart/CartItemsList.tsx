
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import CartItem from './CartItem';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CartItemsListProps {
  cartItems: CartItemType[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  isLoaded: boolean;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  isLoaded
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Use useEffect to set mounted state after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50); // Short delay to prevent flashing
    
    return () => clearTimeout(timer);
  }, []);
  
  // Compute visibility classes based on loading and mounted state
  const visibilityClass = isLoaded && mounted 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';
  
  return (
    <div className={`transition-opacity duration-300 ${visibilityClass}`}>
      <Card className="overflow-hidden border-none shadow-sm rounded-xl">
        <CardHeader className="bg-white border-b border-gray-100 p-3">
          <CardTitle className="text-sm md:text-base font-medium text-gray-800 flex items-center">
            <div className="h-5 w-5 bg-kutuku-light rounded-full flex items-center justify-center mr-2">
              <ShoppingBag className="h-3 w-3 text-kutuku-primary" />
            </div>
            Items ({cartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-kutuku-primary mb-4" />
              <p className="text-muted-foreground">Loading your cart items...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <CartItem 
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="p-3 bg-gray-50 flex justify-between">
          <Button variant="outline" size="sm" asChild className="text-xs rounded-full">
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default React.memo(CartItemsList);
