
import React from 'react';
import { Clock, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();
  
  if (history.length === 0) return null;

  return (
    <div className={cn(
      "rounded-lg shadow-sm p-4",
      isDarkMode ? "bg-gray-800/90 border border-gray-700" : "bg-white",
      className
    )}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn(
          "text-base font-medium flex items-center",
          isDarkMode ? "text-white" : ""
        )}>
          <Clock className="h-4 w-4 mr-2 text-orange-500" />
          Recent Searches
        </h3>
        {history.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllHistory}
            className={cn(
              "text-xs flex items-center",
              isDarkMode 
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
                : "text-gray-500 hover:text-gray-700"
            )}
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
            className={cn(
              "group flex items-center px-3 py-1.5 rounded-full",
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                : "bg-orange-50 hover:bg-orange-100 border-orange-200 text-gray-700"
            )}
          >
            <button
              onClick={() => onSelectHistoryItem(item.query)}
              className={isDarkMode ? "mr-1 text-gray-200" : "mr-1 text-gray-700"}
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
              <X className={cn(
                "h-3 w-3",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )} />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
