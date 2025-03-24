
import { useState, useEffect } from 'react';
import { SearchPageProduct } from '@/lib/types/search';
import { supabase } from '@/integrations/supabase/client';

interface UseSearchResult {
  searchResults: SearchPageProduct[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
}

export const useSearch = (
  query: string,
  page: number = 1,
  limit: number = 16
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

        // Then get the page of products
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*, shop:shop_id(name, logo)')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
          .range(offset, offset + limit - 1);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        // Transform the data to match SearchPageProduct type
        const transformedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          salePrice: product.sale_price,
          images: product.images || [],
          category: product.category_id || '',
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          shop: product.shop ? {
            id: product.shop_id,
            name: product.shop.name,
            logo: product.shop.logo
          } : null,
          isNew: product.is_new || false,
          colors: product.colors || [],
          sizes: product.sizes || [],
          isTrending: product.is_trending || false
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
  }, [query, page, limit]);

  return {
    searchResults,
    isLoading,
    error,
    totalResults
  };
};
