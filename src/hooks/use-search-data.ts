import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SearchPageProduct } from '@/components/search/SearchProductCard';

export const useSearchData = (query: string) => {
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Add pagination state
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [pageCount, setPageCount] = useState(1);
  
  const fetchData = async () => {
    // Always set loading at the start
    setLoading(true);
    setError(null);
    
    // Log incoming query for debugging
    console.log('[useSearchData] Query:', query, typeof query);
    
    // Skip fetching if we're on initial load and have no query
    if (initialLoad && !query) {
      console.log('[useSearchData] Initial load with no query, skipping fetch');
      setLoading(false);
      return;
    }

    try {      
      // Fetch products matching the search query
      let productsQuery = supabase
        .from('products')
        .select('*');
      
      if (query && query.trim()) {
        console.log('[useSearchData] Searching for:', query.trim());
        productsQuery = productsQuery.ilike('name', `%${query.trim()}%`);
      } else {
        console.log('[useSearchData] No query provided, fetching all products');
      }
      
      const { data: productsData, error: productsError } = await productsQuery;
      
      if (productsError) {
        console.error('[useSearchData] Error fetching products:', productsError);
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }
      
      console.log('[useSearchData] Search results count:', productsData?.length || 0);
      
      if (productsData && productsData.length > 0) {
        console.log('[useSearchData] First result:', productsData[0].name);
      } else {
        console.log('[useSearchData] No results found');
      }
      
      // Format product data
      const formattedProducts: SearchPageProduct[] = (productsData || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        images: product.images || ['/placeholder.svg'],
        category_id: product.category_id || '',
        shop_id: product.shop_id,
        is_new: product.is_new || false,
        is_trending: product.is_trending || false,
        colors: product.colors || [],
        sizes: product.sizes || [],
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        stock: product.stock || 0
      }));
      
      setProducts(formattedProducts);
      setTotalProducts(formattedProducts.length);
      setPageCount(Math.ceil(formattedProducts.length / resultsPerPage));

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        setCategories([]);
      } else {
        setCategories(categoriesData || []);
      }

      // Fetch shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*');
      
      if (shopsError) {
        console.error('Error fetching shops:', shopsError);
        setShops([]);
      } else {
        setShops(shopsData || []);
      }
      
      // Save search history if query exists
      if (query) {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          try {
            await supabase.from('search_history').upsert(
              { 
                user_id: session.session.user.id,
                query: query.toLowerCase().trim(),
                searched_at: new Date().toISOString() 
              },
              { onConflict: 'user_id,query', ignoreDuplicates: false }
            );
          } catch (historyError) {
            console.error('Error saving search history:', historyError);
          }
        }
      }
      
      setInitialLoad(false);
    } catch (err: any) {
      console.error('Search error:', err);
      
      setError(err?.message || 'Failed to fetch data');
      toast({
        title: "Error fetching search results",
        description: "Please try again later",
        variant: "destructive"
      });
      
      // Set empty results on error
      setProducts([]);
      setTotalProducts(0);
      setPageCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when query changes
  useEffect(() => {
    fetchData();
  }, [query]);

  return {
    products,
    categories,
    shops,
    loading,
    error,
    initialLoad,
    fetchData,
    totalProducts,
    pageCount,
    currentPage,
    setCurrentPage,
    resultsPerPage,
    setResultsPerPage
  };
};
