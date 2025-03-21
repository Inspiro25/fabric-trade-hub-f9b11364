// Import mockProducts instead of products from lib/products
import { Product, mockProducts } from '@/lib/products';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    // Load wishlist items from local storage or default to an empty array
    const storedWishlist = localStorage.getItem('wishlist');
    const initialWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

    // For demonstration purposes, let's filter mock products based on IDs in the wishlist
    const productsInWishlist = mockProducts.filter(product => initialWishlist.includes(product.id));
    setWishlistItems(productsInWishlist);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center">
          <Heart className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <p className="text-gray-500">Your wishlist is currently empty.</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
