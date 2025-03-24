
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  variant?: 'default' | 'minimal' | 'dark';
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search for products...',
  onSearch,
  className,
  variant = 'default',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Update local state if initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Apply dark mode styling based on context and variant
  const getStyles = () => {
    if (variant === 'dark' || isDarkMode) {
      return "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400";
    } else if (variant === 'minimal') {
      return "border-0 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0";
    }
    return "";
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2", 
            (variant === 'dark' || isDarkMode) ? "text-gray-400" : "text-gray-500"
          )} 
          size={18} 
        />
        
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn("pl-10 pr-10 py-2 w-full", getStyles())}
          autoFocus={autoFocus}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6",
              isDarkMode && "hover:bg-gray-700 text-gray-400"
            )}
          >
            <X size={16} />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
