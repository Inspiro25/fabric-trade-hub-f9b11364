import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  updateQuantity, 
  removeFromCart 
}) => {
  const { isDarkMode } = useTheme();
  
  // Pre-compute values to avoid recalculation during render
  const itemId = `${item.id}-${item.size}-${item.color}`;
  const itemPrice = item.product.salePrice || item.product.price;
  const totalPrice = itemPrice * item.quantity;
  
  // Handle quantity changes
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };
  
  const handleIncreaseQuantity = () => {
    updateQuantity(itemId, item.quantity + 1);
  };
  
  const handleRemoveItem = () => {
    removeFromCart(itemId);
  };
  
  return (
    <li className={cn(
      "flex items-center gap-3 p-3 transition-colors",
      isDarkMode 
        ? "hover:bg-gray-700/50" 
        : "hover:bg-gray-50"
    )}>
      <div className="flex-shrink-0">
        <Link to={`/product/${item.id}`}>
          <img 
            src={item.product.images[0]} 
            alt={item.product.name} 
            className={cn(
              "w-16 h-16 object-cover rounded-lg",
              isDarkMode ? "shadow-md shadow-black/20" : "shadow-sm"
            )} 
            loading="lazy" // Add lazy loading for images
          />
        </Link>
      </div>
      
      <div className="flex-grow min-w-0">
        <Link 
          to={`/product/${item.id}`} 
          className={cn(
            "font-medium text-sm hover:text-blue-600 transition-colors truncate block",
            isDarkMode ? "text-gray-200" : "text-gray-800"
          )}
        >
          {item.product.name}
        </Link>
        <div className="text-xs mt-0.5 flex flex-wrap gap-1">
          <span className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs",
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          )}>
            {item.size}
          </span>
          <span className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs",
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          )}>
            {item.color}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className={cn(
            "flex items-center border rounded-full overflow-hidden h-6",
            isDarkMode 
              ? "bg-gray-700 border-gray-600" 
              : "bg-white shadow-sm border-gray-200"
          )}>
            <button 
              type="button" 
              className={cn(
                "w-6 h-6 flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "text-gray-400 hover:text-gray-200" 
                  : "text-gray-500 hover:text-gray-700",
                item.quantity <= 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleDecreaseQuantity} 
              disabled={item.quantity <= 1}
            >
              <Minus className="w-2.5 h-2.5" />
              <span className="sr-only">Decrease quantity</span>
            </button>
            <span className={cn(
              "w-6 text-center text-xs font-medium",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}>
              {item.quantity}
            </span>
            <button 
              type="button" 
              className={cn(
                "w-6 h-6 flex items-center justify-center transition-colors",
                isDarkMode 
                  ? "text-gray-400 hover:text-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={handleIncreaseQuantity}
            >
              <Plus className="w-2.5 h-2.5" />
              <span className="sr-only">Increase quantity</span>
            </button>
          </div>
          
          <button 
            type="button" 
            className={cn(
              "w-6 h-6 flex items-center justify-center transition-colors rounded-full",
              isDarkMode 
                ? "text-gray-400 hover:text-red-400 hover:bg-gray-700" 
                : "text-gray-500 hover:text-red-600 hover:bg-red-50"
            )}
            onClick={handleRemoveItem}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="sr-only">Remove item</span>
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <span className={cn(
          "font-medium text-sm min-w-14 block",
          isDarkMode ? "text-gray-200" : "text-gray-800"
        )}>
          ₹{totalPrice.toFixed(2)}
        </span>
        <span className={cn(
          "text-xs",
          isDarkMode ? "text-gray-400" : "text-muted-foreground"
        )}>
          ₹{itemPrice.toFixed(2)} each
        </span>
      </div>
    </li>
  );
};

// Use memo to prevent unnecessary re-renders when parent components change
export default memo(CartItem);
