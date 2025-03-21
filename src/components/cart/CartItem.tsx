
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
            className="w-16 h-16 object-cover rounded-lg shadow-sm" 
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
        
        <div className="flex items-center justify-between mt-2">
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
            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
            <button 
              type="button" 
              className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity + 1)}
            >
              <Plus className="w-2.5 h-2.5" />
              <span className="sr-only">Increase quantity</span>
            </button>
          </div>
          
          <button 
            type="button" 
            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-red-50"
            onClick={() => removeFromCart(`${item.id}-${item.size}-${item.color}`)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="sr-only">Remove item</span>
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <span className="font-medium text-gray-800 text-sm min-w-14 block">
          ₹{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">
          ₹{(item.product.salePrice || item.product.price).toFixed(2)} each
        </span>
      </div>
    </li>
  );
};

export default CartItem;
