
import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { SearchPageProduct } from './SearchProductCard';
import SearchProductCard from './SearchProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SearchRecommendationsProps {
  products: SearchPageProduct[];
  isAddingToCart: string | null;
  isAddingToWishlist: string | null;
  onAddToCart: (product: SearchPageProduct) => void;
  onAddToWishlist: (product: SearchPageProduct) => void;
  onShare: (product: SearchPageProduct) => void;
  onSelectProduct: (productId: string) => void;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
}

const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({
  products,
  isAddingToCart,
  isAddingToWishlist,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onSelectProduct,
  emptyStateIcon,
  emptyStateTitle = "No recommendations available",
  emptyStateMessage = "Browse our products to get personalized recommendations"
}) => {
  const { isDarkMode } = useTheme();
  
  if (products.length === 0) {
    return (
      <div className={cn(
        "text-center py-8",
        isDarkMode ? "text-gray-300" : "text-gray-500"
      )}>
        {emptyStateIcon || <TrendingUp className={cn(
          "h-12 w-12 mx-auto mb-2", 
          isDarkMode ? "text-gray-600" : "text-gray-300"
        )} />}
        <h3 className={cn(
          "text-lg font-medium mb-1", 
          isDarkMode ? "text-white" : ""
        )}>{emptyStateTitle}</h3>
        <p className={cn(
          "text-sm", 
          isDarkMode ? "text-gray-400" : ""
        )}>{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 rounded-lg",
      isDarkMode ? "bg-gray-800/80 border border-gray-700" : "bg-white shadow-sm"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          "text-lg font-medium flex items-center",
          isDarkMode ? "text-white" : ""
        )}>
          <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
          Recommends
        </h3>
        
        <Button variant="link" className={cn(
          "text-orange-500 p-0 h-auto text-sm",
          isDarkMode ? "hover:text-orange-400" : "hover:text-orange-600"
        )} asChild>
          <Link to="/recommendations">View All <ChevronRight className="h-3 w-3 ml-1" /></Link>
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
              isAddingToCart={isAddingToCart === product.id}
              isAddingToWishlist={isAddingToWishlist === product.id}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onShare={onShare}
              viewMode="grid"
              isCompact={true}
              buttonColor={isDarkMode ? "bg-orange-600 hover:bg-orange-700" : "bg-orange-500 hover:bg-orange-600"}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchRecommendations;
