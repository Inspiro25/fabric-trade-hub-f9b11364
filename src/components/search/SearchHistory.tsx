
import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchHistoryProps {
  history: { id: string; query: string }[];
  onSelectHistoryItem: (query: string) => void;
  onClearHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistoryItem,
  onClearAllHistory
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          Recent Searches
        </h3>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllHistory}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            <button
              onClick={() => onSelectHistoryItem(item.query)}
              className="mr-1"
            >
              {item.query}
            </button>
            <button
              onClick={() => onClearHistoryItem(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove search history item"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
