
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/features/ProductGrid';
import { formatCategoryName, slugToCategory } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useProductsByCategory } from '@/hooks/use-product-fetching';
import { supabase } from '@/integrations/supabase/client';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<{ id: string; name: string; description: string | null; image: string | null } | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'>('newest');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Fetch category details first
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categorySlug) return;
      
      try {
        // Decode the slug to get the original category name
        const categoryName = slugToCategory(categorySlug);
        
        // Fetch the category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .ilike('name', categoryName)
          .single();
        
        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          return;
        }
        
        if (categoryData) {
          setCategory(categoryData);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
    
    fetchCategory();
  }, [categorySlug]);
  
  // Use our new hook to fetch products by category
  const { data, isLoading, error } = useProductsByCategory(
    category?.id || '',
    page,
    12,
    sortBy
  );
  
  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity') => {
    setSortBy(newSortBy);
    setPage(1);
  };
  
  if (isLoading && !category) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "h-8 w-32 rounded animate-pulse",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )}></div>
          <div className={cn(
            "h-8 w-8 rounded animate-pulse",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )}></div>
        </div>
        
        <div className={cn(
          "h-40 w-full rounded-lg mb-6 animate-pulse",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )}></div>
        
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn(
              "h-60 rounded animate-pulse",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )}></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      {/* Header with back button */}
      <div className={cn(
        "sticky top-0 z-10 p-4 border-b flex items-center justify-between",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className={isDarkMode ? "text-gray-300 hover:text-white" : ""}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-lg font-medium">{category?.name || formatCategoryName(categorySlug || '')}</h1>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      {/* Category banner */}
      {category?.image && (
        <div className="relative h-40 w-full mb-4">
          <img 
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className={cn(
            "absolute inset-0 flex flex-col justify-end p-4",
            isDarkMode 
              ? "bg-gradient-to-t from-gray-900/90 to-transparent" 
              : "bg-gradient-to-t from-white/80 to-transparent"
          )}>
            <h2 className="text-2xl font-bold">{category.name}</h2>
            {category.description && (
              <p className={cn(
                "text-sm mt-1",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                {category.description}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Products grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={cn(
                "h-60 rounded animate-pulse",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )}></div>
            ))}
          </div>
        ) : error ? (
          <div className={cn(
            "text-center py-12 px-4",
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          )}>
            <h3 className="text-lg font-medium mb-2">Error loading products</h3>
            <p className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              We couldn't load products for this category. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid 
            products={products} 
            columns={2} 
            showPagination={totalProducts > 12}
            itemsPerPage={12}
            totalItems={totalProducts}
            currentPage={page}
            onPageChange={handlePageChange}
            showFilters={true}
            useAlternateLayout={true}
          />
        ) : (
          <div className={cn(
            "text-center py-12 px-4",
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          )}>
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              We couldn't find any products in this category.
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
