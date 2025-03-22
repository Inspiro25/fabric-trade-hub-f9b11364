
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNewArrivals } from '@/lib/products';
import AppHeader from '@/components/features/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Flame, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/lib/types/product';

// Define a proper type for the products returned from Supabase
interface SupabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string;
  shop_id: string;
  is_new: boolean;
  is_trending: boolean;
  colors: string[];
  sizes: string[];
  rating: number;
  review_count: number;
  stock?: number;
  created_at?: string;
  tags?: string[];
}

// Create a union type that can be either a Product or SupabaseProduct
type ProductUnion = Product | SupabaseProduct;

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', 'newArrivals'],
    queryFn: async () => {
      try {
        // Fetch new arrivals directly from Supabase
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
        
        return data as SupabaseProduct[] || [];
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err);
        // Fall back to the existing implementation
        return getNewArrivals();
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
          const { error } = await supabase.rpc('record_product_view', {
            p_user_id: session.session.user.id,
            p_product_id: products[0].id,
            p_view_increment: 1
          });
          
          if (error) {
            console.error('Error recording featured product view:', error);
          }
        } catch (err) {
          console.error('Failed to record product view:', err);
        }
      }
    };
    
    updateProductViews();
  }, [products]);

  // Helper function to get sale price safely
  const getSalePrice = (product: ProductUnion): number | null => {
    return 'sale_price' in product ? product.sale_price : product.salePrice || null;
  };

  // Helper function to calculate discount percentage
  const calculateDiscount = (product: ProductUnion): number => {
    const salePrice = getSalePrice(product);
    if (!salePrice) return 0;
    return Math.round(((product.price - salePrice) / product.price) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Flame className={cn(
              "h-5 w-5 text-kutuku-primary",
              isDarkMode && "text-orange-300"
            )} />
            <h1 className="text-2xl font-bold">New Arrivals</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Discover our latest and most exciting products
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">Failed to load products. Please try again later.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No new arrivals found at the moment.</p>
          </div>
        ) : (
          <>
            {/* Featured New Arrival */}
            {products.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <h2 className="font-semibold">Featured New Arrival</h2>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={products[0].images[0]} 
                        alt={products[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <h3 className="text-xl font-bold mb-2">{products[0].name}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {products[0].description || "Experience our newest arrival, crafted with exceptional quality and style."}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {getSalePrice(products[0]) ? (
                          <>
                            <span className="text-xl font-bold">₹{getSalePrice(products[0])}</span>
                            <span className="text-muted-foreground line-through">₹{products[0].price}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {calculateDiscount(products[0])}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold">₹{products[0].price}</span>
                        )}
                      </div>
                      <Link 
                        to={`/product/${products[0].id}`}
                        className="inline-flex items-center justify-center bg-kutuku-primary hover:bg-kutuku-secondary text-white py-2 px-4 rounded-md transition-colors"
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
              <h2 className="text-xl font-semibold mb-4">All New Arrivals</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
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
