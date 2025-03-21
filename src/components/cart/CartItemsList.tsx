
import React from 'react';
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
import { Loader2 } from 'lucide-react';

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
  return (
    <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#FFF0EA] to-[#FFEDDE] p-3">
          <CardTitle className="text-base font-medium text-gray-800">Items in Your Cart ({cartItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-kutuku-primary mb-4" />
              <p className="text-muted-foreground">Loading your cart items...</p>
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
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CartItemsList;
