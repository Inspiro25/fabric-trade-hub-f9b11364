
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const SearchErrorState: React.FC<SearchErrorStateProps> = ({ error, onRetry }) => {
  const isApiUnavailable = error.includes('API endpoint might be unavailable') || 
                          error.includes('HTML instead of JSON');
  
  return (
    <div className="text-red-500 py-12 text-center">
      <p className="mb-3 font-semibold text-xl">Error: {error}</p>
      <p className="text-sm mb-6">
        {isApiUnavailable 
          ? 'The product API is currently unavailable. This might be because the backend service is down.' 
          : 'Please try refreshing the page or try again later.'}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="flex items-center"
          size="lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default SearchErrorState;
