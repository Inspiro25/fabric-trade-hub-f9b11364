
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SearchHistoryItem {
  id: string;
  query: string;
  searched_at: string;
}

export const useSearchHistory = (userId: string | null) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchSearchHistory = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching search history:', error);
        return;
      }
      
      setSearchHistory(data || []);
    } catch (err) {
      console.error('Error fetching search history:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPopularSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('popular_search_terms')
        .select('query, count')
        .order('count', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching popular searches:', error);
        setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
        return;
      }
      
      if (data && data.length > 0) {
        setPopularSearches(data.map(item => item.query));
      } else {
        setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
      }
    } catch (err) {
      console.error('Error fetching popular searches:', err);
      setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
    }
  };

  const clearSearchHistoryItem = async (id: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error deleting search history item:', error);
        return;
      }
      
      setSearchHistory(prevHistory => 
        prevHistory.filter(item => item.id !== id)
      );
    } catch (err) {
      console.error('Error deleting search history item:', err);
    }
  };
  
  const clearAllSearchHistory = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error clearing search history:', error);
        return;
      }
      
      setSearchHistory([]);
      toast({
        title: "Search history cleared",
        description: "Your search history has been deleted"
      });
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!userId) return;
    
    try {
      await supabase
        .from('search_history')
        .upsert(
          { 
            user_id: userId,
            query: query.toLowerCase().trim(),
            searched_at: new Date().toISOString() 
          },
          { onConflict: 'user_id,query', ignoreDuplicates: false }
        );
      
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };
  
  // Alias for addToSearchHistory to maintain compatibility
  const addToSearchHistory = saveSearchHistory;
  
  // Alias for clearAllSearchHistory to maintain compatibility
  const clearSearchHistory = clearAllSearchHistory;
  
  useEffect(() => {
    if (userId) {
      fetchSearchHistory();
    }
    fetchPopularSearches();
  }, [userId]);

  return {
    searchHistory,
    popularSearches,
    isLoading,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    saveSearchHistory,
    fetchSearchHistory,
    // Aliases for backward compatibility
    addToSearchHistory,
    clearSearchHistory
  };
};
