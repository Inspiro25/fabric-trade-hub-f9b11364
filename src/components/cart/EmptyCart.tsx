import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const EmptyCart: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "text-center py-10 rounded-xl p-6 max-w-md mx-auto",
      isDarkMode 
        ? "bg-gray-800 border border-gray-700 shadow-lg shadow-black/20" 
        : "bg-white shadow-sm"
    )}>
      <div className={cn(
        "inline-flex justify-center items-center p-3 rounded-full mb-4",
        isDarkMode ? "bg-gray-700" : "bg-blue-50"
      )}>
        <ShoppingCart className={cn(
          "w-8 h-8",
          isDarkMode ? "text-blue-400" : "text-blue-600"
        )} />
      </div>
      <h2 className={cn(
        "text-lg font-semibold mb-2",
        isDarkMode ? "text-gray-100" : "text-gray-900"
      )}>Your cart is empty</h2>
      <p className={cn(
        "mb-6 text-sm max-w-xs mx-auto",
        isDarkMode ? "text-gray-300" : "text-muted-foreground"
      )}>
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button 
        size="lg" 
        asChild 
        className={cn(
          "rounded-full text-white",
          isDarkMode 
            ? "bg-blue-600 hover:bg-blue-700" 
            : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        <Link to="/">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
