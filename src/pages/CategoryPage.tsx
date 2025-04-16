import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCategoryName, slugToCategory } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useCategoryProducts } from '@/hooks/use-category-products';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getCategoriesWithDetails } from '@/lib/products/categories';
import ProductCard from '@/components/ProductCard';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [category, setCategory] = useState<{ id: string; name: string; description: string | null; image: string | null } | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity'>('newest');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categorySlug) return;
      
      try {
        const categoryName = slugToCategory(categorySlug);
        
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .ilike('name', categoryName)
          .single();
        
        if (categoryError) throw categoryError;
        
        if (categoryData) {
          setCategory(categoryData);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
    
    fetchCategory();
  }, [categorySlug]);
  
  const { data: products, isLoading, error } = useCategoryProducts(
    category?.id || '',
    12
  );
  
  const totalProducts = products?.length || 0;
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };
  
  const handleSortChange = (newSortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity') => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const data = await getCategoriesWithDetails();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchAllCategories();
  }, []);

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      <div className={cn(
        "sticky top-0 z-10 p-4 border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}>
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className={isDarkMode ? "text-gray-300 hover:text-white" : ""}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-lg font-medium">
            {category?.name || formatCategoryName(categorySlug || '')}
          </h1>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={cat.id === category?.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "transition-colors",
                  cat.id === category?.id
                    ? isDarkMode 
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                    : isDarkMode
                      ? "border-gray-700 hover:border-orange-500/50 hover:text-orange-400"
                      : "border-gray-200 hover:border-orange-500/50 hover:text-orange-500"
                )}
                onClick={() => navigate(`/categories/${cat.name.toLowerCase()}`)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      
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
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images?.[0] || '/placeholder.svg'}
                category={product.category}
                isNew={product.isNew}
                isTrending={product.isTrending}
                rating={product.rating}
                reviewCount={product.reviewCount}
                isDarkMode={isDarkMode}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
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
