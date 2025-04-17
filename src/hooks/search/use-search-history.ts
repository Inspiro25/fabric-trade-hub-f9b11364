import { useState } from 'react';

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
}

export const useSearchHistory = (userId?: string | null) => {
  const [searchHistory, setSearchHistory] = useState<Array<SearchHistoryItem>>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>(['Shoes', 'Electronics', 'Fashion', 'Home']);
  
  const saveSearchHistory = (searchQuery: string) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date()
    };
    
    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
  };
  
  const clearSearchHistoryItem = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const clearAllSearchHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchHistory,
    popularSearches,
    saveSearchHistory,
    clearSearchHistoryItem,
    clearAllSearchHistory
  };
};
