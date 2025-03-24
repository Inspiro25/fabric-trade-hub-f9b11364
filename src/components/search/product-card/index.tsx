
import React from 'react';
import { GridProductCard } from './GridProductCard';
import { ListProductCard } from './ListProductCard';
import { CompactProductCard } from './CompactProductCard';
import { SearchPageProduct } from '@/hooks/search/types';

export interface ProductCardProps {
  product: SearchPageProduct;
  isAddingToCart?: string | boolean;
  isAddingToWishlist?: string | boolean;
  onAddToCart?: (product: SearchPageProduct) => void;
  onAddToWishlist?: (product: SearchPageProduct) => void;
  onShare?: (product: SearchPageProduct) => void;
  onClick?: (product: SearchPageProduct) => void;
  buttonColor?: string;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { viewMode = 'grid', isCompact = false, ...rest } = props;
  
  if (isCompact) {
    return <CompactProductCard {...rest} />;
  }
  
  if (viewMode === 'list') {
    return <ListProductCard {...rest} />;
  }
  
  return <GridProductCard {...rest} />;
};

export default ProductCard;
