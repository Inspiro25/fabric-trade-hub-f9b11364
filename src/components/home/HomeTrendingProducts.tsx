
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTrendingProducts } from '@/hooks/use-product-fetching';
import ProductCard from '@/components/ui/ProductCard';

const HomeTrendingProducts = () => {
  const { isDarkMode } = useTheme();
  const { data: trendingProducts = [], isLoading, error } = useTrendingProducts(8);

  return (
    <section className="py-10 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : ""
          )}>
            Trending Products
          </h2>
          <Link to="/trending">
            <Button variant="link" className={isDarkMode ? "text-orange-400" : "text-orange-500"}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-3">
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-red-500">Error loading trending products</p>
          </div>
        ) : trendingProducts.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>No trending products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images[0]}
                category={product.category}
                isNew={product.isNew}
                isTrending={true}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeTrendingProducts;
