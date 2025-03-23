
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Flame, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/lib/types/product';

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: async () => {
      try {
        // Get current date and date 30 days ago
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Fetch new arrivals from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)
          .order('created_at', { ascending: false })
          .limit(12);
          
        if (error) {
          console.error('Error fetching new arrivals:', error);
          throw new Error(error.message);
        }
        
        // Map the database products to our Product type
        return data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category_id || '',
          colors: product.colors || [],
          sizes: product.sizes || [],
          isNew: product.is_new || false,
          isTrending: product.is_trending || false,
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          stock: product.stock || 0,
          tags: product.tags || [],
          shopId: product.shop_id || '',
        }));
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update view history if user is logged in
  useEffect(() => {
    const updateProductViews = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user && products && products.length > 0) {
        try {
          // Update product view history for the current user
          const { error } = await supabase
            .from('product_view_history')
            .upsert({
              user_id: session.session.user.id,
              product_id: products[0].id,
              view_count: 1,
              last_viewed_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,product_id',
              ignoreDuplicates: false
            });
          
          if (error) {
            console.error('Error recording product view:', error);
          }
        } catch (err) {
          console.error('Failed to record product view:', err);
        }
      }
    };
    
    updateProductViews();
  }, [products]);

  // Helper function to calculate discount percentage
  const calculateDiscount = (product: Product): number => {
    if (!product.salePrice) return 0;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-slate-900" : "bg-slate-50"
    )}>
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Flame className={cn(
              "h-5 w-5",
              isDarkMode ? "text-orange-300" : "text-kutuku-primary"
            )} />
            <h1 className={cn(
              "text-2xl font-bold",
              isDarkMode && "text-white"
            )}>New Arrivals</h1>
          </div>
          <p className={cn(
            "mt-1",
            isDarkMode ? "text-gray-300" : "text-muted-foreground"
          )}>
            Discover our latest and most exciting products
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className={cn(
                "h-64 rounded-lg",
                isDarkMode ? "bg-gray-800" : ""
              )} />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className={cn(
              "text-lg",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>Failed to load products. Please try again later.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="py-12 text-center">
            <p className={cn(
              "text-lg",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>No new arrivals found at the moment.</p>
          </div>
        ) : (
          <>
            {/* Featured New Arrival */}
            {products.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <h2 className={cn(
                    "font-semibold",
                    isDarkMode && "text-white"
                  )}>Featured New Arrival</h2>
                </div>
                <div className={cn(
                  "rounded-lg shadow-sm overflow-hidden",
                  isDarkMode ? "bg-slate-800" : "bg-white"
                )}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={products[0].images[0]} 
                        alt={products[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <h3 className={cn(
                        "text-xl font-bold mb-2",
                        isDarkMode && "text-white"
                      )}>{products[0].name}</h3>
                      <p className={cn(
                        "mb-4 line-clamp-3",
                        isDarkMode ? "text-gray-300" : "text-muted-foreground"
                      )}>
                        {products[0].description || "Experience our newest arrival, crafted with exceptional quality and style."}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {products[0].salePrice ? (
                          <>
                            <span className={cn(
                              "text-xl font-bold",
                              isDarkMode ? "text-orange-400" : ""
                            )}>₹{products[0].salePrice}</span>
                            <span className={cn(
                              "line-through",
                              isDarkMode ? "text-gray-400" : "text-muted-foreground"
                            )}>₹{products[0].price}</span>
                            <span className={cn(
                              "text-xs px-2 py-1 rounded",
                              isDarkMode 
                                ? "bg-green-900/30 text-green-400" 
                                : "bg-green-100 text-green-800"
                            )}>
                              {calculateDiscount(products[0])}% OFF
                            </span>
                          </>
                        ) : (
                          <span className={cn(
                            "text-xl font-bold",
                            isDarkMode && "text-white"
                          )}>₹{products[0].price}</span>
                        )}
                      </div>
                      <Link 
                        to={`/product/${products[0].id}`}
                        className={cn(
                          "inline-flex items-center justify-center py-2 px-4 rounded-md transition-colors",
                          isDarkMode 
                            ? "bg-orange-600 hover:bg-orange-700 text-white" 
                            : "bg-kutuku-primary hover:bg-kutuku-secondary text-white"
                        )}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* All New Arrivals */}
            <div className="mb-6">
              <h2 className={cn(
                "text-xl font-semibold mb-4",
                isDarkMode && "text-white"
              )}>All New Arrivals</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice}
                    image={product.images[0]}
                    category={product.category}
                    isNew={product.isNew}
                    isTrending={product.isTrending}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default NewArrivals;
