
import React from 'react';
import { GridProductCard } from './GridProductCard';
import { ListProductCard } from './ListProductCard';
import { CompactProductCard } from './CompactProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { ProductCardBaseProps, SearchPageProduct } from '@/hooks/search/types';

const ProductCard = ({ viewMode = 'grid', ...props }: ProductCardBaseProps) => {
  if (viewMode === 'list') {
    return <ListProductCard {...props} />;
  } else {
    return <GridProductCard {...props} />;
  }
};

export { ProductCardSkeleton, CompactProductCard };
export type { SearchPageProduct, ProductCardBaseProps };
export default ProductCard;
