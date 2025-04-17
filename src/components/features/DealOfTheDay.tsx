
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getDealOfTheDay, DealProduct } from '@/lib/products/deal';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DealOfTheDay = () => {
  const [deal, setDeal] = useState<DealProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setIsLoading(true);
        const dealProduct = await getDealOfTheDay();
        setDeal(dealProduct);
        
        if (dealProduct && dealProduct.colors.length > 0) {
          setSelectedColor(dealProduct.colors[0]);
        }
        if (dealProduct && dealProduct.sizes.length > 0) {
          setSelectedSize(dealProduct.sizes[0]);
        }
      } catch (error) {
        console.error('Error fetching deal of the day:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeal();
  }, []);
  
  useEffect(() => {
    if (!deal) return;
    
    const calculateTimeLeft = () => {
      const difference = deal.endTime.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timerId);
  }, [deal]);
  
  const handleAddToCart = useCallback(() => {
    if (!deal) return;
    
    const colorToUse = selectedColor || deal.colors[0] || 'default';
    const sizeToUse = selectedSize || deal.sizes[0] || 'default';
    
    addToCart(
      deal, 
      1, 
      colorToUse, 
      sizeToUse
    );
    
    toast.success(`Added ${deal.name} to cart (${sizeToUse}, ${colorToUse})`);
  }, [deal, selectedColor, selectedSize, addToCart]);
  
  if (isLoading) {
    return (
      <section className="mb-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </section>
    );
  }
  
  if (!deal) {
    return null;
  }
  
  return (
    <section className="mb-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Deal of the Day</h2>
        <a href="/category/deals" className="text-kutuku-primary text-sm font-medium flex items-center">
          See All
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </a>
      </div>
      
      <div className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <div className="relative aspect-[5/3] w-full">
          <Link to={`/product/${deal.id}`}>
            <img 
              src={deal.images[0] || "https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1974"} 
              alt={deal.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            -{deal.discountPercentage}%
          </div>
        </div>
        <div className="p-4">
          <Link to={`/product/${deal.id}`}>
            <h3 className="text-base font-medium mb-1">{deal.name}</h3>
          </Link>
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-kutuku-primary mr-2">{formatCurrency(deal.salePrice || 0)}</span>
            <span className="text-sm line-through text-gray-400">{formatCurrency(deal.price)}</span>
          </div>
          
          {deal.colors.length > 0 && (
            <Select
              value={selectedColor}
              onValueChange={setSelectedColor}
            >
              <SelectTrigger className={`w-full text-xs h-8 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                <SelectValue placeholder="Select Color" />
              </SelectTrigger>
              <SelectContent>
                {deal.colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {deal.sizes.length > 0 && (
            <Select
              value={selectedSize}
              onValueChange={setSelectedSize}
            >
              <SelectTrigger className={`w-full text-xs h-8 ${isDarkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {deal.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className={`rounded-md p-2 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="block text-sm font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Hours</span>
            </div>
            <div className={`rounded-md p-2 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="block text-sm font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Mins</span>
            </div>
            <div className={`rounded-md p-2 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span className="block text-sm font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Secs</span>
            </div>
            <Button 
              className="bg-kutuku-primary hover:bg-kutuku-secondary text-white w-full"
              onClick={handleAddToCart}
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(DealOfTheDay);
