
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden border bg-background">
      <Skeleton className="h-48 w-full" />
      <div className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
