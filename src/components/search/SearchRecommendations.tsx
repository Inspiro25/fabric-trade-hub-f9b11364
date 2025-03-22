import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { SearchPageProduct } from './SearchProductCard';
import SearchProductCard from './SearchProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <h3 className="text-lg font-medium mb-1">No recommendations available</h3>
        <p className="text-sm">Browse our products to get personalized recommendations</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-[#9b87f5]" />
          Recommended For You
        </h3>
        
        <Button variant="link" className="text-[#9b87f5] p-0 h-auto text-sm">
          View All <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {products.slice(0, 4).map((product) => (
          <motion.div 
            key={product.id} 
            onClick={() => onSelectProduct(product.id)}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchRecommendations;
