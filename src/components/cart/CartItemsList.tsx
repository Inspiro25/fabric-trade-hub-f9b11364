
import React, { useEffect, useState, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { type CartItem as CartItemType } from "@/contexts/CartContext";
import CartItem from './CartItem';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader2, ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Image } from '@/components/ui/image';
import { formatPrice } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <div
        key={item.id}
        className={cn(
          "flex gap-4 p-4 rounded-lg transition-all duration-200",
          isDarkMode 
            ? "bg-gray-800 hover:bg-gray-700/50" 
            : "bg-white shadow-sm hover:shadow-md"
        )}
      >
        <div className="relative w-24 h-24">
          <Image
            src={item.image}
            alt={item.name}
            className="rounded-md object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "font-medium",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {item.name}
          </h3>
          
          <div className={cn(
            "mt-1 text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {item.color && (
              <span className="mr-2">Color: {item.color}</span>
            )}
            {item.size && (
              <span>Size: {item.size}</span>
            )}
          </div>
          
          <div className={cn(
            "mt-2 font-medium",
            isDarkMode ? "text-blue-400" : "text-blue-600"
          )}>
            ₹{item.price}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isDarkMode 
                    ? "border-gray-700 hover:bg-gray-700" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className={cn(
                "w-8 text-center",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isDarkMode 
                    ? "border-gray-700 hover:bg-gray-700" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-red-500 hover:text-red-600",
                isDarkMode 
                  ? "hover:bg-gray-700" 
                  : "hover:bg-red-50"
              )}
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ));
  }, [cartItems, updateQuantity, removeFromCart, isDarkMode]);
  
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
            isDarkMode ? "bg-gray-700" : "bg-blue-50"
          )}>
            <ShoppingBag className={cn(
              "h-3 w-3",
              isDarkMode ? "text-blue-400" : "text-blue-600"
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
          <div className="space-y-4">
            {cartItemElements}
          </div>
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
