
import React from 'react';

const SearchEmptyState: React.FC = () => {
  return (
    <div className="text-gray-500 py-12 text-center">
      <p className="mb-3 text-lg font-medium">No products found matching your search criteria.</p>
      <p className="text-sm">Try adjusting your filters or search for something else.</p>
    </div>
  );
};

export default SearchEmptyState;
