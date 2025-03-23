
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/features/ProductGrid';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/products';
import { formatCategoryName, slugToCategory } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<{ id: string; name: string; description: string | null; image: string | null } | null>(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);
        
        if (!categorySlug) return;
        
        // Decode the slug to get the original category name
        const categoryName = slugToCategory(categorySlug);
        
        // First, fetch the category details
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
          
          // Then fetch products for this category
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id);
          
          if (productsError) {
            console.error('Error fetching products:', productsError);
            return;
          }
          
          if (productsData) {
            const formattedProducts: Product[] = productsData.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description || '',
              price: product.price,
              salePrice: product.sale_price,
              images: product.images || [],
              category: product.category_id,
              isNew: product.is_new || false,
              isTrending: product.is_trending || false,
              colors: product.colors || [],
              sizes: product.sizes || [],
              rating: product.rating || 0,
              reviewCount: product.review_count || 0,
              stock: product.stock || 0,
              tags: product.tags || [],
              shopId: product.shop_id || '',
            }));
            
            setProducts(formattedProducts);
          }
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryAndProducts();
  }, [categorySlug]);
  
  if (isLoading) {
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
        {products.length > 0 ? (
          <ProductGrid 
            products={products} 
            columns={2} 
            showPagination={products.length > 12}
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
