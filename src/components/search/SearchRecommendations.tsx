
import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/products';
import { SearchPageProduct } from '@/hooks/search/types';
import { useSearchCartIntegration } from '@/hooks/search/use-search-cart-integration';
import { GridProductCard } from '@/components/search/product-card/GridProductCard';
import useAuthDialog from '@/hooks/search/use-auth-dialog';

interface SimilarProductProps {
  productId: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  withViewMore?: boolean;
  onViewMore?: () => void;
  showTitle?: boolean;
}

export function SearchRecommendations({
  productId,
  title = "You may also like",
  subtitle,
  limit = 4,
  withViewMore = false,
  onViewMore,
  showTitle = true
}: SimilarProductProps) {
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleAddToCart, handleAddToWishlist, handleShareProduct } = useSearchCartIntegration();
  const { openLoginDialog } = useAuthDialog();
  
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch based on the product category, tags, etc.
        // For now, we'll use mock data
        const mockSimilarProducts = generateMockProducts(productId, limit);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProducts(mockSimilarProducts);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSimilarProducts();
  }, [productId, limit]);

  const handleProductClick = (product: SearchPageProduct) => {
    if (product.id) {
      window.location.href = `/product/${product.id}`;
    }
  };

  if (products.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="w-full py-8">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: limit }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-md mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id}>
                <GridProductCard 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onShare={handleShareProduct}
                  onClick={handleProductClick}
                />
              </div>
            ))}
          </div>
          
          {withViewMore && onViewMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onViewMore}
                className="px-6 py-2 bg-accent text-accent-foreground hover:bg-accent/80 rounded-md transition-colors"
              >
                View more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Helper function to generate realistic mock data
function generateMockProducts(excludeId: string, limit: number): SearchPageProduct[] {
  // Array of realistic product names
  const names = [
    "Wireless Bluetooth Earbuds",
    "Ultra HD Smart TV",
    "Ergonomic Office Chair",
    "Stainless Steel Water Bottle",
    "Portable Power Bank",
    "Digital Fitness Watch",
    "Smart Home Security Camera",
    "Noise-Canceling Headphones",
    "Ceramic Coffee Mug Set",
    "Wireless Charging Pad"
  ];
  
  // Generate random products
  return Array.from({ length: limit }).map((_, idx) => {
    const id = `rec-${idx + 1}`;
    const hasDiscount = Math.random() > 0.6;
    const price = Math.floor(Math.random() * 200) + 15;
    const discount = hasDiscount ? Math.floor(price * (0.1 + Math.random() * 0.3)) : undefined;
    
    return {
      id,
      name: names[Math.floor(Math.random() * names.length)],
      price,
      sale_price: hasDiscount ? price - discount! : undefined,
      images: [`https://source.unsplash.com/random/300x300/?product&${id}`],
      rating: 3 + Math.random() * 2,
      review_count: Math.floor(Math.random() * 500),
      is_new: Math.random() > 0.7,
      is_trending: Math.random() > 0.8,
      category_id: ["Electronics", "Home & Kitchen", "Fashion", "Sports"][Math.floor(Math.random() * 4)],
      stock: Math.floor(Math.random() * 50) + 5,
      colors: ["red", "blue", "black"],
      sizes: ["S", "M", "L"],
      tags: ["trending", "popular"],
    };
  }).filter(product => product.id !== excludeId);
}

// Function to get recommended products for a category
export async function getRecommendedProductsForCategory(categoryId: string, limit = 8): Promise<SearchPageProduct[]> {
  try {
    // In a real app, fetch from API
    // For now, use mock data
    const mockProducts: SearchPageProduct[] = Array.from({ length: limit }).map((_, idx) => {
      const id = `cat-${categoryId}-rec-${idx + 1}`;
      const hasDiscount = Math.random() > 0.6;
      const price = Math.floor(Math.random() * 200) + 15;
      const discount = hasDiscount ? Math.floor(price * (0.1 + Math.random() * 0.3)) : undefined;
      
      return {
        id,
        name: `Product for ${categoryId} #${idx + 1}`,
        price,
        sale_price: hasDiscount ? price - discount! : undefined,
        images: [`https://source.unsplash.com/random/300x300/?${categoryId}&${id}`],
        rating: 3 + Math.random() * 2,
        review_count: Math.floor(Math.random() * 500),
        is_new: Math.random() > 0.7,
        is_trending: Math.random() > 0.8,
        category_id: categoryId,
        stock: Math.floor(Math.random() * 50) + 5,
        colors: ["red", "blue", "black"],
        sizes: ["S", "M", "L"],
        tags: ["trending", "popular"],
      };
    });
    
    return mockProducts;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return [];
  }
}

// Function to get trending products
export async function getTrendingProducts(limit = 8): Promise<SearchPageProduct[]> {
  try {
    // In a real app, fetch from API
    // For now, use mock data
    const mockProducts: SearchPageProduct[] = Array.from({ length: limit }).map((_, idx) => {
      const id = `trending-${idx + 1}`;
      const hasDiscount = Math.random() > 0.6;
      const price = Math.floor(Math.random() * 200) + 15;
      const discount = hasDiscount ? Math.floor(price * (0.1 + Math.random() * 0.3)) : undefined;
      
      return {
        id,
        name: `Trending Product #${idx + 1}`,
        price,
        sale_price: hasDiscount ? price - discount! : undefined,
        images: [`https://source.unsplash.com/random/300x300/?trending&${id}`],
        rating: 4 + Math.random(),
        review_count: Math.floor(Math.random() * 1000) + 200,
        is_new: Math.random() > 0.5,
        is_trending: true,
        category_id: ["Electronics", "Home & Kitchen", "Fashion", "Sports"][Math.floor(Math.random() * 4)],
        stock: Math.floor(Math.random() * 50) + 5,
        colors: ["red", "blue", "black"],
        sizes: ["S", "M", "L"],
        tags: ["trending", "popular"],
      };
    });
    
    return mockProducts;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}
