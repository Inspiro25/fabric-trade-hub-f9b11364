import { useState, useEffect, useCallback } from 'react';
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
  
  const fetchData = useCallback(async () => {
    console.log('[useSearchData] fetchData called with query:', query);
    setLoading(true);
    setError(null);

    try {
      if (query) {
        console.log('[useSearchData] Fetching products for query:', query);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${query}%`)
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('[useSearchData] Error fetching products:', productsError);
          throw productsError;
        }

        console.log('[useSearchData] Products fetched:', productsData);
        setProducts(productsData || []);
        setTotalProducts(productsData?.length || 0);
      } else {
        console.log('[useSearchData] No query provided, fetching all products');
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('[useSearchData] Error fetching all products:', productsError);
          throw productsError;
        }

        console.log('[useSearchData] All products fetched:', productsData);
        setProducts(productsData || []);
        setTotalProducts(productsData?.length || 0);
      }

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('[useSearchData] Error fetching categories:', categoriesError);
        throw categoriesError;
      }

      setCategories(categoriesData || []);

      // Fetch shops
      const { data: shopsData, error: shopsError } = await supabase
        .from('shops')
        .select('*')
        .order('name');

      if (shopsError) {
        console.error('[useSearchData] Error fetching shops:', shopsError);
        throw shopsError;
      }

      setShops(shopsData || []);
    } catch (err) {
      console.error('[useSearchData] Error in fetchData:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Fetch data when query changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
