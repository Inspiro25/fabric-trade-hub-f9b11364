
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/CartContext';

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
  return (
    <li className="flex items-center gap-3 p-3 transition-colors hover:bg-gray-50">
      <div className="flex-shrink-0">
        <Link to={`/product/${item.id}`}>
          <img 
            src={item.product.images[0]} 
            alt={item.product.name} 
            className="w-14 h-14 object-cover rounded-md shadow-sm" 
          />
        </Link>
      </div>
      
      <div className="flex-grow min-w-0">
        <Link to={`/product/${item.id}`} className="font-medium text-sm text-gray-800 hover:text-kutuku-primary transition-colors truncate block">
          {item.product.name}
        </Link>
        <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-1">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">
            {item.size}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-xs">
            {item.color}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-full overflow-hidden bg-white shadow-sm h-6">
          <button 
            type="button" 
            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity - 1)} 
            disabled={item.quantity <= 1}
          >
            <Minus className="w-2.5 h-2.5" />
            <span className="sr-only">Decrease quantity</span>
          </button>
          <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
          <button 
            type="button" 
            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity + 1)}
          >
            <Plus className="w-2.5 h-2.5" />
            <span className="sr-only">Increase quantity</span>
          </button>
        </div>
        
        <span className="font-medium text-gray-800 text-xs min-w-14 text-right">
          ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
        </span>
        
        <button 
          type="button" 
          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-red-50"
          onClick={() => removeFromCart(`${item.id}-${item.size}-${item.color}`)}
        >
          <X className="w-3 h-3" />
          <span className="sr-only">Remove item</span>
        </button>
      </div>
    </li>
  );
};

export default CartItem;
