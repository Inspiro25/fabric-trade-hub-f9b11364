
import React from 'react';
import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchHistoryProps {
  history: { id: string; query: string }[];
  onSelectHistoryItem: (query: string) => void;
  onClearHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
  className?: string;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistoryItem,
  onClearAllHistory,
  className
}) => {
  if (history.length === 0) return null;

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2 text-kutuku-primary" />
          Recent Searches
        </h3>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllHistory}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <Badge 
            key={item.id} 
            variant="outline"
            className="group flex items-center bg-orange-50 hover:bg-orange-100 border-orange-200 px-3 py-1.5 rounded-full"
          >
            <button
              onClick={() => onSelectHistoryItem(item.query)}
              className="mr-1 text-gray-700"
            >
              {item.query}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearHistoryItem(item.id);
              }}
              className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Remove search history item"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
