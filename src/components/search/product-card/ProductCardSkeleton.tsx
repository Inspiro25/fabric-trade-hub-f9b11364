
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <AspectRatio ratio={1}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      
      <div className="p-4">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
};
