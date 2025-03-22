
export * from './types';
export * from './CompactProductCard';
export * from './GridProductCard';
export * from './ListProductCard';
export * from './ProductCardSkeleton';

import { SearchPageProduct, ProductCardBaseProps } from './types';
import { CompactProductCard } from './CompactProductCard';
import { GridProductCard } from './GridProductCard';
import { ListProductCard } from './ListProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import React from 'react';

interface SearchProductCardProps extends ProductCardBaseProps {
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
  buttonColor?: string; // Add the new buttonColor prop
}

const SearchProductCard: React.FC<SearchProductCardProps> = ({
  product,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onClick,
  viewMode = 'grid',
  isCompact = false,
  buttonColor // Include buttonColor in the props
}) => {
  if (isCompact) {
    return (
      <CompactProductCard
        product={product}
        isAddingToCart={isAddingToCart}
        isAddingToWishlist={isAddingToWishlist}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onShare={onShare}
        onClick={onClick}
        buttonColor={buttonColor} // Pass buttonColor to CompactProductCard
      />
    );
  }
  
  if (viewMode === 'list') {
    return (
      <ListProductCard
        product={product}
        isAddingToCart={isAddingToCart}
        isAddingToWishlist={isAddingToWishlist}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onShare={onShare}
        onClick={onClick}
        buttonColor={buttonColor} // Pass buttonColor to ListProductCard
      />
    );
  }
  
  // Default to grid view
  return (
    <GridProductCard
      product={product}
      isAddingToCart={isAddingToCart}
      isAddingToWishlist={isAddingToWishlist}
      onAddToCart={onAddToCart}
      onAddToWishlist={onAddToWishlist}
      onShare={onShare}
      onClick={onClick}
      buttonColor={buttonColor} // Pass buttonColor to GridProductCard
    />
  );
};

export default SearchProductCard;
export { ProductCardSkeleton as SearchProductSkeleton };
