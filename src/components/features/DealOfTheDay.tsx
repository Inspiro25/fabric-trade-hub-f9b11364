
import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { Timer, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/products/types';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDealOfTheDay } from '@/lib/products/deal';
import { Skeleton } from '@/components/ui/skeleton';

interface DealOfTheDayProps {
  product?: Product;
}

const DealOfTheDayContent: React.FC<{product: Product}> = ({ product }) => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  return (
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
  );
};

const DealOfTheDay: React.FC<DealOfTheDayProps> = ({ product: propProduct }) => {
  // Fetch deal of the day if not provided through props
  const { data: dealProduct, isLoading, error } = useQuery({
    queryKey: ['dealOfTheDay'],
    queryFn: getDealOfTheDay,
    enabled: !propProduct // Only fetch if no product prop is provided
  });

  // Use provided product prop or the fetched deal product
  const product = propProduct || dealProduct;

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="mr-4">
              <Skeleton className="h-6 w-24 mb-3" />
              <Skeleton className="h-32 w-32 rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-5 w-1/4 mb-3" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error || !product) {
    console.error('Error loading deal of the day:', error);
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">
            Unable to load today's deal. Please check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <DealOfTheDayContent product={product} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default DealOfTheDay;
