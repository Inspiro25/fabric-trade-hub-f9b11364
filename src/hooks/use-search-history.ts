
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchHistoryItem {
  id: string;
  query: string;
  searched_at: string;
  user_id?: string;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  const fetchSearchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated && currentUser?.id) {
        // Fetch from database if user is logged in
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('searched_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        setSearchHistory(data || []);
      } else {
        // Use local storage for guest users
        const localHistory = localStorage.getItem('guest_search_history');
        if (localHistory) {
          try {
            const parsedHistory = JSON.parse(localHistory);
            setSearchHistory(parsedHistory);
          } catch (e) {
            console.error('Error parsing search history:', e);
            setSearchHistory([]);
            localStorage.removeItem('guest_search_history');
          }
        } else {
          setSearchHistory([]);
        }
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      setSearchHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, isAuthenticated]);

  useEffect(() => {
    fetchSearchHistory();
  }, [fetchSearchHistory]);

  const addSearchHistoryItem = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    try {
      // Check if this query already exists in recent history to avoid duplicates
      const isDuplicate = searchHistory.some(item => 
        item.query.toLowerCase() === query.toLowerCase()
      );
      
      if (isDuplicate) return;
      
      const newItem: SearchHistoryItem = {
        id: crypto.randomUUID(),
        query,
        searched_at: new Date().toISOString(),
        user_id: currentUser?.id
      };
      
      if (isAuthenticated && currentUser?.id) {
        // Save to database for logged in users
        const { error } = await supabase
          .from('search_history')
          .insert({
            query,
            user_id: currentUser.id
          });
        
        if (error) throw error;
        
        // We'll fetch the latest history to get the server-generated ID
        fetchSearchHistory();
      } else {
        // Save to local storage for guest users
        const updatedHistory = [newItem, ...searchHistory].slice(0, 10);
        localStorage.setItem('guest_search_history', JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
      }
    } catch (error) {
      console.error('Error adding search history item:', error);
    }
  }, [currentUser?.id, fetchSearchHistory, isAuthenticated, searchHistory]);

  const clearSearchHistoryItem = useCallback(async (id: string) => {
    try {
      if (isAuthenticated && currentUser?.id) {
        // Delete from database for logged in users
        const { error } = await supabase
          .from('search_history')
          .delete()
          .eq('id', id)
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
      }
      
      // Update state and local storage
      const updatedHistory = searchHistory.filter(item => item.id !== id);
      setSearchHistory(updatedHistory);
      
      if (!isAuthenticated) {
        localStorage.setItem('guest_search_history', JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Error removing search history item:', error);
    }
  }, [currentUser?.id, isAuthenticated, searchHistory]);

  const clearAllSearchHistory = useCallback(async () => {
    try {
      if (isAuthenticated && currentUser?.id) {
        // Delete all search history for this user
        const { error } = await supabase
          .from('search_history')
          .delete()
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
      }
      
      // Clear state and local storage
      setSearchHistory([]);
      localStorage.removeItem('guest_search_history');
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, [currentUser?.id, isAuthenticated]);

  return {
    searchHistory,
    isLoading,
    addSearchHistoryItem,
    clearSearchHistoryItem,
    clearAllSearchHistory,
    className: isDarkMode ? 'dark-mode-search-history' : 'light-mode-search-history'
  };
};
