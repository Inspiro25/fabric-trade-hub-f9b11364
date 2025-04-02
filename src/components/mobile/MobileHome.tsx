
import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/lib/products/types';
import { useHomePageData } from '@/hooks/use-home-data';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Minimal version of MobileHome to prevent errors
const MobileHome = () => {
  const { products, isLoading } = useProducts();
  const [dataLoaded, setDataLoaded] = useState(false);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    // Set dataLoaded to true after a short delay to simulate data loading
    const timer = setTimeout(() => {
      setDataLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !dataLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-2">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={cn(
        "text-2xl font-bold mb-4",
        isDarkMode ? "text-white" : "text-gray-900"
      )}>Today's Picks</h1>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className={cn(
            "text-xl font-semibold",
            isDarkMode ? "text-gray-200" : "text-gray-800"
          )}>Featured Products</h2>
          <Link to="/search" className={cn(
            "text-sm flex items-center",
            isDarkMode ? "text-blue-400" : "text-blue-600"
          )}>
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {products.slice(0, 4).map(product => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              className={cn(
                "border rounded-lg overflow-hidden bg-white transition-transform duration-200 hover:shadow-md",
                isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200"
              )}
            >
              <div className="aspect-square relative">
                <AspectRatio ratio={1/1}>
                  {product.images && product.images[0] && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AspectRatio>
                
                {product.salePrice && (
                  <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge>
                )}
              </div>
              
              <div className="p-3">
                <h3 className={cn(
                  "text-sm font-medium line-clamp-1",
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                )}>{product.name}</h3>
                
                <div className={cn(
                  "flex items-center mt-1",
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                )}>
                  <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                  {product.salePrice && (
                    <p className="text-xs line-through text-gray-500 ml-2">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* New Arrivals Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className={cn(
              "text-xl font-semibold",
              isDarkMode ? "text-gray-200" : "text-gray-800" 
            )}>New Arrivals</h2>
            <Link to="/new-arrivals" className={cn(
              "text-sm flex items-center",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}>
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {products.slice(4, 8).map(product => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id}
                className={cn(
                  "border rounded-lg overflow-hidden bg-white",
                  isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200"
                )}
              >
                <div className="aspect-square relative">
                  <AspectRatio ratio={1/1}>
                    {product.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </AspectRatio>
                </div>
                
                <div className="p-3">
                  <h3 className={cn(
                    "text-sm font-medium line-clamp-1",
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  )}>{product.name}</h3>
                  
                  <div className={cn(
                    "mt-1",
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  )}>
                    <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className={cn(
          "my-6 p-4 rounded-lg text-center",
          isDarkMode ? "bg-gray-700" : "bg-blue-50"
        )}>
          <h3 className={cn(
            "text-lg font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>Find More Products</h3>
          <p className={cn(
            "text-sm mb-3",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>Discover our full collection of quality products</p>
          <Button className="w-full" variant="default">
            Browse Categories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
