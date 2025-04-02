import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewArrivals } from '@/lib/products/newArrivals';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProductGrid } from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewArrivals = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: getNewArrivals
  });

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 backdrop-blur-md px-3 py-2 border-b",
        isDarkMode 
          ? "bg-gray-800/80 border-gray-700" 
          : "bg-white/80 border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full",
              isDarkMode ? "text-gray-300" : ""
            )} 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : ""
          )}>New Arrivals</h1>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        <ProductGrid 
          products={products || []} 
          isLoading={isLoading}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default NewArrivals;