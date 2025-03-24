
import { useState, useEffect } from 'react';
import { SearchPageProduct } from '@/hooks/search/types';
import { supabase } from '@/integrations/supabase/client';

interface UseSearchResult {
  searchResults: SearchPageProduct[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  products?: SearchPageProduct[]; // Added for backwards compatibility
  totalProducts?: number; // Added for backwards compatibility
}

export const useSearch = (
  query: string,
  page: number = 1,
  limit: number = 16,
  filters?: string[] | number
): UseSearchResult => {
  const [searchResults, setSearchResults] = useState<SearchPageProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setTotalResults(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Record the search query in history
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.user) {
            await supabase.from('search_history').insert({
              user_id: session.session.user.id,
              query
            });
          }
        } catch (err) {
          console.error('Failed to record search history:', err);
        }

        // Update popular search terms
        try {
          const { data: existingTerm } = await supabase
            .from('popular_search_terms')
            .select('*')
            .eq('query', query.toLowerCase())
            .single();

          if (existingTerm) {
            await supabase
              .from('popular_search_terms')
              .update({ count: existingTerm.count + 1 })
              .eq('id', existingTerm.id);
          } else {
            await supabase
              .from('popular_search_terms')
              .insert({ query: query.toLowerCase(), count: 1 });
          }
        } catch (err) {
          console.error('Failed to update popular search terms:', err);
        }

        // Perform the actual search
        const offset = (page - 1) * limit;

        // First get the count of matching products
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);

        // Apply filters if provided
        let queryBuilder = supabase
          .from('products')
          .select('*, shop:shop_id(name, logo)')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
        
        // Add category filter if it exists in the filters array
        if (filters && Array.isArray(filters) && filters.length > 0) {
          // Apply each filter based on its type
          filters.forEach(filter => {
            if (filter.startsWith('category:')) {
              const category = filter.split(':')[1];
              queryBuilder = queryBuilder.eq('category_id', category);
            } else if (filter.startsWith('price:')) {
              const [min, max] = filter.split(':')[1].split('-').map(Number);
              queryBuilder = queryBuilder.gte('price', min).lte('price', max);
            }
          });
        }

        // Apply pagination
        queryBuilder = queryBuilder.range(offset, offset + limit - 1);

        const { data, error: fetchError } = await queryBuilder;

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        // Transform the data to match SearchPageProduct type
        const transformedProducts: SearchPageProduct[] = (data || []).map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          sale_price: product.sale_price,
          images: product.images || [],
          category_id: product.category_id || '',
          rating: product.rating || 0,
          review_count: product.review_count || 0,
          shop: product.shop ? {
            id: product.shop_id,
            name: product.shop.name,
            logo: product.shop.logo
          } : product.shop_id,
          is_new: product.is_new || false,
          colors: product.colors || [],
          sizes: product.sizes || [],
          is_trending: product.is_trending || false
        }));

        setSearchResults(transformedProducts);
        setTotalResults(count || 0);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching. Please try again.');
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page, limit, filters]);

  return {
    searchResults,
    isLoading,
    error,
    totalResults,
    products: searchResults, // Add alias for backward compatibility
    totalProducts: totalResults // Add alias for backward compatibility
  };
};
