
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { SearchPageProduct } from './SearchProductCard';
import SearchProductCard from './SearchProductCard';

interface SearchRecommendationsProps {
  products: SearchPageProduct[];
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShare: (product: SearchPageProduct) => void;
  onSelectProduct: (productId: string) => void;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({
  products,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onSelectProduct
}) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium flex items-center mb-3">
        <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
        Recommended For You
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} onClick={() => onSelectProduct(product.id)}>
            <SearchProductCard
              product={product}
              isAddingToCart={isAddingToCart}
              isAddingToWishlist={isAddingToWishlist}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onShare={onShare}
              viewMode="grid"
              isCompact={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRecommendations;
