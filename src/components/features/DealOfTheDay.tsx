import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Timer, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/products/types';
import { Link } from 'react-router-dom';

interface DealOfTheDayProps {
  product: Product;
}

const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ product }) => {
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const { addToCart } = useCart();

  // Calculate the time remaining until the end of the day
  const getTimeRemaining = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const timeDiff = endOfDay.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setIsTimerExpired(true);
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [time, setTime] = useState(getTimeRemaining());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product.id,
        product.name,
        product.images[0],
        product.sale_price || product.price,
        product.stock,
        product.shop_id || '',
        product.sale_price || null
      );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-4">
            <Badge variant="secondary">
              <Timer className="mr-2 h-4 w-4" />
              Deal of the Day
            </Badge>
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0] || '/placeholder.png'}
                alt={product.name}
                className="mt-3 h-32 w-32 rounded-md object-cover"
              />
            </Link>
          </div>
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg">{product.name}</h3>
            </Link>
            <p className="text-sm text-gray-500">{product.description}</p>
            <div className="mt-2 flex items-center">
              <span className="font-bold">
                {formatCurrency(product.sale_price || product.price)}
              </span>
              {product.sale_price && (
                <span className="ml-2 text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {!isTimerExpired ? (
              <div className="mt-3 text-xs text-gray-600">
                Time remaining: {time.hours}h {time.minutes}m {time.seconds}s
              </div>
            ) : (
              <div className="mt-3 text-xs text-red-600">Deal expired!</div>
            )}
            <Button
              size="sm"
              className={cn("mt-4 w-full md:w-auto", isTimerExpired && "disabled")}
              onClick={handleAddToCart}
              disabled={isTimerExpired}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealOfTheDay;
