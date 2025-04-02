
import React, { useEffect, useState, memo, useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

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
    // Skip timer, just set mounted to true on first render
    setMounted(true);
  }, []);
  
  // Memoize the rendering of cart items to prevent unnecessary re-renders
  const cartItemElements = useMemo(() => {
    return cartItems.map((item) => (
      <CartItem 
        key={`${item.id}-${item.size}-${item.color}`}
        item={item}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    ));
  }, [cartItems, updateQuantity, removeFromCart]);
  
  // Fast loaded state check using a simpler condition
  const showContent = isLoaded && mounted;
  
  // Improved loading skeleton
  if (!showContent) {
    return (
      <Card className={cn(
        "overflow-hidden border-none shadow-sm rounded-xl animate-in fade-in",
        isDarkMode && "bg-transparent"
      )}>
        <CardHeader className={cn(
          "p-3 border-b",
          isDarkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-100"
        )}>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 rounded-full mr-2" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardHeader>
        <CardContent className={cn(
          "p-0",
          isDarkMode ? "bg-gray-800" : ""
        )}>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 flex items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-sm rounded-xl animate-in fade-in",
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
        {cartItems.length === 0 ? (
          <div className="py-8 text-center">
            <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>Your cart is empty</p>
          </div>
        ) : (
          <ul className={cn(
            "divide-y",
            isDarkMode ? "divide-gray-700" : "divide-gray-100"
          )}>
            {cartItemElements}
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
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(CartItemsList);
