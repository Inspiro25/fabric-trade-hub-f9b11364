
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface SearchErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const SearchErrorState: React.FC<SearchErrorStateProps> = ({ error, onRetry }) => {
  const isApiUnavailable = error.includes('API endpoint') || 
                          error.includes('HTML instead of JSON') ||
                          error.includes('Failed to fetch products') ||
                          error.includes('database') ||
                          error.includes('connection');
  
  return (
    <Alert variant="destructive" className="my-8">
      <AlertTitle className="text-lg font-semibold">{isApiUnavailable ? 'Database Connection Issue' : 'Error'}</AlertTitle>
      <AlertDescription>
        <p className="mb-4">{error}</p>
        <p className="text-sm mb-4">
          {isApiUnavailable 
            ? 'There was an issue connecting to the database. This could be temporary. Showing mock data instead.' 
            : 'Please try refreshing the page or try again later.'}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="flex items-center"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SearchErrorState;
