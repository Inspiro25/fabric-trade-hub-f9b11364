
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/products/types';

interface CartItemProps {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, product, quantity, size, color }) => {
  const { removeFromCart, updateQuantity, increaseQuantity, decreaseQuantity } = useCart();

  const handleRemove = () => {
    removeFromCart(id);
  };

  const handleIncreaseQuantity = () => {
    increaseQuantity(id);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      decreaseQuantity(id);
    }
  };

  const finalPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price !== undefined && product.sale_price < product.price;

  return (
    <div className="flex border-b border-gray-200 py-4 last:border-0 dark:border-gray-700">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {product.name}
            </h3>
            <div className="mt-1 flex text-xs text-gray-500 dark:text-gray-400">
              {color && (
                <p className="mr-2">
                  Color: <span className="font-medium">{color}</span>
                </p>
              )}
              {size && (
                <p>
                  Size: <span className="font-medium">{size}</span>
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(finalPrice)}
            </div>
            {hasDiscount && (
              <div className="flex items-center justify-end">
                <span className="text-xs line-through text-gray-500 mr-1">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant="destructive" className="h-4 text-[10px]">
                  Sale
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
