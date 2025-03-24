
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  autoFocus = false,
  className
}) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("relative flex items-center w-full", className)}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for products, brands, and more..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "pl-10 pr-10 h-11 w-full",
          isDarkMode 
            ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-gray-600" 
            : "bg-white border-gray-300"
        )}
      />
      <SearchIcon 
        className={cn(
          "absolute left-3 h-5 w-5",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )} 
      />
      
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-8 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className={cn(
          "absolute right-1 h-8 rounded-md",
          isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
        )}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
