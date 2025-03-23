
import React, { useEffect, useState, memo } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
  const { isDarkMode } = useTheme();
  
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
    <div className={`transition-all duration-300 ${visibilityClass}`}>
      <Card className={cn(
        "overflow-hidden border-none shadow-sm rounded-xl",
        isDarkMode && "bg-transparent"
      )}>
        <CardHeader className={cn(
          "p-3 border-b",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-100"
        )}>
          <CardTitle className={cn(
            "text-sm md:text-base font-medium flex items-center",
            isDarkMode ? "text-gray-100" : "text-gray-800"
          )}>
            <div className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center mr-2",
              isDarkMode ? "bg-gray-700" : "bg-kutuku-light"
            )}>
              <ShoppingBag className={cn(
                "h-3 w-3",
                isDarkMode ? "text-orange-400" : "text-kutuku-primary"
              )} />
            </div>
            Items ({cartItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(
          "p-0",
          isDarkMode ? "bg-gray-800" : ""
        )}>
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className={cn(
                "h-8 w-8 animate-spin mb-4",
                isDarkMode ? "text-orange-400" : "text-kutuku-primary"
              )} />
              <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>Loading your cart items...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-8 text-center">
              <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>Your cart is empty</p>
            </div>
          ) : (
            <ul className={cn(
              "divide-y",
              isDarkMode ? "divide-gray-700" : "divide-gray-100"
            )}>
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
        <CardFooter className={cn(
          "p-3 flex justify-between",
          isDarkMode 
            ? "bg-gray-700" 
            : "bg-gray-50"
        )}>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className={cn(
              "text-xs rounded-full",
              isDarkMode && "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-gray-200"
            )}
          >
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

// Use memo to prevent unnecessary re-renders
export default memo(CartItemsList);
