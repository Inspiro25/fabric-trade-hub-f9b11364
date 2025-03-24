
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SearchHistoryItem {
  id: string;
  query: string;
  searched_at: string;
  user_id?: string;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch search history from Supabase
  const fetchSearchHistory = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) {
      // If not authenticated, try to get search history from local storage
      try {
        const localHistory = localStorage.getItem('searchHistory');
        if (localHistory) {
          setSearchHistory(JSON.parse(localHistory));
        }
      } catch (error) {
        console.error('Error retrieving search history from local storage:', error);
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('searched_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setSearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch search history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser?.id, toast]);

  useEffect(() => {
    fetchSearchHistory();
  }, [fetchSearchHistory]);

  // Add search term to history
  const addSearchHistory = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const newSearchItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      searched_at: new Date().toISOString(),
      user_id: currentUser?.id,
    };

    if (!isAuthenticated || !currentUser?.id) {
      // If not authenticated, save to local storage
      try {
        const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        
        // Check for duplicates and remove them
        const filteredHistory = existingHistory.filter(
          (item: SearchHistoryItem) => item.query !== query
        );
        
        // Add new item at the beginning
        const updatedHistory = [newSearchItem, ...filteredHistory].slice(0, 10);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
      } catch (error) {
        console.error('Error saving search history to local storage:', error);
      }
      return;
    }

    try {
      // First, check if the search term already exists
      const { data: existingData, error: existingError } = await supabase
        .from('search_history')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('query', query)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error checking existing search term:', existingError);
      }

      if (existingData) {
        // If it exists, update the timestamp
        const { error: updateError } = await supabase
          .from('search_history')
          .update({ searched_at: new Date().toISOString() })
          .eq('id', existingData.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // If it doesn't exist, insert a new record
        const { error: insertError } = await supabase
          .from('search_history')
          .insert([
            {
              query: query,
              user_id: currentUser.id,
            },
          ]);

        if (insertError) {
          throw insertError;
        }
      }

      // Fetch updated history
      fetchSearchHistory();
    } catch (error) {
      console.error('Error adding search history:', error);
    }
  }, [isAuthenticated, currentUser?.id, fetchSearchHistory]);

  // Clear search history (one item)
  const clearSearchHistoryItem = useCallback(async (id: string) => {
    if (!isAuthenticated || !currentUser?.id) {
      // If not authenticated, remove from local storage
      try {
        const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const updatedHistory = existingHistory.filter(
          (item: SearchHistoryItem) => item.id !== id
        );
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
      } catch (error) {
        console.error('Error removing search history from local storage:', error);
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) {
        throw error;
      }

      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error clearing search history item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove search item',
        variant: 'destructive',
      });
    }
  }, [isAuthenticated, currentUser?.id, toast]);

  // Clear all search history
  const clearAllSearchHistory = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) {
      // If not authenticated, clear local storage
      localStorage.removeItem('searchHistory');
      setSearchHistory([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) {
        throw error;
      }

      setSearchHistory([]);
      toast({
        title: 'Success',
        description: 'Search history cleared',
      });
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear search history',
        variant: 'destructive',
      });
    }
  }, [isAuthenticated, currentUser?.id, toast]);

  return {
    searchHistory,
    isLoading,
    addSearchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory,
  };
};
