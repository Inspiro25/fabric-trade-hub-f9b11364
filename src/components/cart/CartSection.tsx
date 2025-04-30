import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export const CartSection = () => {
  const { getCartCount } = useCart();
  const { isDarkMode } = useTheme();
  const itemCount = getCartCount();

  return (
    <Link 
      to="/cart" 
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg transition-colors",
        isDarkMode 
          ? "hover:bg-gray-800" 
          : "hover:bg-blue-50"
      )}
    >
      <div className="relative">
        <ShoppingBag className={cn(
          "h-5 w-5",
          isDarkMode ? "text-blue-400" : "text-blue-600"
        )} />
        {itemCount > 0 && (
          <span className={cn(
            "absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium",
            isDarkMode 
              ? "bg-blue-500 text-white" 
              : "bg-blue-600 text-white"
          )}>
            {itemCount}
          </span>
        )}
      </div>
      <span className={cn(
        "text-sm font-medium hidden md:inline",
        isDarkMode ? "text-gray-200" : "text-gray-700"
      )}>
        Cart
      </span>
    </Link>
  );
};
