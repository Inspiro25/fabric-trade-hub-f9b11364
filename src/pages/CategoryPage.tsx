import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductsByCategory } from '@/hooks/use-product-fetching';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/lib/products/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const itemsPerPage = 12;

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode } = useTheme();
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    // Convert category slug to ID (replace with your actual logic)
    const categoryIdFromSlug = (slug: string | undefined) => {
      switch (slug) {
        case 't-shirts': return 't-shirts';
        case 'hoodies': return 'hoodies';
        case 'jeans': return 'jeans';
        case 'jackets': return 'jackets';
        case 'shoes': return 'shoes';
        default: return null;
      }
    };

    const id = categoryIdFromSlug(categorySlug);
    setCategoryId(id);
    setCurrentPage(1); // Reset page on category change
  }, [categorySlug]);

  const { products, loading, error, totalCount } = useProductsByCategory(categoryId || '', itemsPerPage, currentPage);
  const isLoading = loading;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className={cn(
      "container mx-auto py-8",
      isDarkMode ? "dark" : ""
    )}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold capitalize">{categorySlug?.replace(/-/g, ' ')}</h1>
        <p className="text-gray-500">
          {isLoading ? 'Loading products...' : `Showing ${products.length} of ${totalCount} products`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-w-4 aspect-h-5">
                <Skeleton className="w-full h-full" />
              </div>
              <CardHeader>
                <CardTitle><Skeleton className="h-4 w-3/4" /></CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="text-gray-500">Please check back later.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="mr-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
