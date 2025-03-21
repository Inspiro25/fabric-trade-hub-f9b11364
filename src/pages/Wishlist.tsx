
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  
  // Filter products to show only those in wishlist
  const wishlistItems = products.filter(product => wishlist.includes(product.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-3">
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-lg font-medium">My Wishlist</h1>
          </div>
          <Link to="/cart">
            <ShoppingBag size={22} />
          </Link>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-4 text-gray-400">
            <Heart size={48} />
          </div>
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-xs mb-6">
            Save your favorite items to your wishlist and they'll appear here
          </p>
          <Button asChild>
            <Link to="/">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {wishlistItems.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
