
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/hooks/search/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          throw new Error(error.message);
        }

        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
