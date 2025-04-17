
import React from 'react';
import { Loader2 } from 'lucide-react';

const SearchLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      <span className="text-lg">Loading products...</span>
    </div>
  );
};

export default SearchLoadingState;
