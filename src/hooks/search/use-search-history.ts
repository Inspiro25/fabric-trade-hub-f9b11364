import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([
    "Shoes", "T-shirts", "Dresses", "Jeans", "Jackets", "Watches", "Bags"
  ]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadSearchHistory = () => {
      try {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory));
        }
      } catch (err) {
        console.error('Error loading search history:', err);
        // Reset if corrupt
        localStorage.removeItem('searchHistory');
      }
    };

    loadSearchHistory();
  }, [currentUser?.id]);

  const saveSearchHistory = (query: string) => {
    if (!query.trim()) return;

    try {
      // Add to the beginning, remove duplicates, and keep max 10 items
      const updatedHistory = [
        query, 
        ...searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase())
      ].slice(0, 10);
      
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Error saving search history:', err);
    }
  };

  const clearSearchHistoryItem = (query: string) => {
    const updatedHistory = searchHistory.filter(
      item => item.toLowerCase() !== query.toLowerCase()
    );
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const clearAllSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return {
    searchHistory,
    popularSearches,
    saveSearchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory
  };
}
