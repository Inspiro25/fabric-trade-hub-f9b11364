
import React from 'react';

interface SectionLoadingProps {
  itemCount?: number;
}

const SectionLoading: React.FC<SectionLoadingProps> = ({ itemCount = 4 }) => {
  return (
    <div className="px-4 py-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-2 gap-3">
        {Array(itemCount).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
        ))}
      </div>
    </div>
  );
};

export default SectionLoading;
