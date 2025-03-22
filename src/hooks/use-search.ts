import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/lib/products/types';

export interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  isTrending: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  shopId: string | null;
  // Add any other properties specific to the search page product
}

const useSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('items') || '20', 10);
  const sort = searchParams.get('sort') || '';
  const viewMode = searchParams.get('view') === 'list' ? 'list' : 'grid';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate fetching data from an API
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockProducts: SearchPageProduct[] = Array.from({ length: itemsPerPage }, (_, i) => ({
          id: `product-${i + (page - 1) * itemsPerPage}`,
          name: `${query} Product ${i + (page - 1) * itemsPerPage}`,
          description: 'This is a sample product description.',
          price: Math.floor(Math.random() * 100) + 20,
          salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : null,
          images: ['/placeholder.svg'],
          category: category || 'All',
          colors: ['red', 'blue', 'green'],
          sizes: ['S', 'M', 'L'],
          isNew: Math.random() > 0.5,
          isTrending: Math.random() > 0.5,
          rating: Math.floor(Math.random() * 5) + 1,
          reviewCount: Math.floor(Math.random() * 100),
          stock: Math.floor(Math.random() * 50),
          tags: ['sample', 'product'],
          shopId: 'shop-123',
        }));

        setProducts(mockProducts);
        setTotalProducts(100); // Simulate total number of products
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category, page, itemsPerPage, sort]);

  const handleAddToCart = (product: SearchPageProduct) => {
    setIsAddingToCart(product.id);

    // Convert SearchPageProduct to the Product type expected by addToCart
    const productForCart = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images || [],
      // Add any other required properties
      sale_price: product.salePrice,
      description: product.description || '',
      category_id: product.category || '',
      // Default values for required properties that might not be in SearchPageProduct
      colors: product.colors || [],
      sizes: product.sizes || [],
      stock: product.stock || 0,
      rating: product.rating || 0,
      review_count: product.reviewCount || 0,
      shop_id: product.shopId || null,
      is_new: product.isNew || false,
      is_trending: product.isTrending || false,
      tags: product.tags || []
    };

    addToCart(productForCart, 1);
    
    setTimeout(() => {
      setIsAddingToCart(null);
      toast.success(`${product.name} added to cart`);
    }, 500);
  };

  const handleAddToWishlist = (product: SearchPageProduct) => {
    setIsAddingToWishlist(product.id);
    
    setTimeout(() => {
      addToWishlist(product.id);
      setIsAddingToWishlist(null);
      toast.success(`${product.name} added to wishlist`);
    }, 500);
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).then(() => {
        toast.success('Product shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share product');
      });
    } else {
      toast.warn('Web Share API not supported');
    }
  };
  
  const handleRetry = () => {
    router.refresh();
  };

  return {
    loading,
    error,
    products,
    totalProducts,
    isAddingToCart,
    isAddingToWishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleShareProduct,
    handleRetry,
    query,
    category,
    page,
    itemsPerPage,
    sort,
    viewMode,
    createQueryString
  };
};

export default useSearch;
