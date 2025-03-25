
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { ShoppingCart, Trash } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/products/types';

const WishlistPage = () => {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();
  const { isDarkMode } = useTheme();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItemIds.length === wishlist.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(wishlist.map(item => item.id));
    }
  };
  
  // Handle select individual item
  const handleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };
  
  // Handle add selected items to cart
  const handleAddSelectedToCart = () => {
    selectedItemIds.forEach(id => {
      const product = wishlist.find(item => item.id === id);
      if (product) {
        addToCart(product);
      }
    });
    
    // Clear selection after adding to cart
    setSelectedItemIds([]);
  };
  
  // Handle remove selected items from wishlist
  const handleRemoveSelected = () => {
    selectedItemIds.forEach(id => {
      removeFromWishlist(id);
    });
    
    // Clear selection after removing
    setSelectedItemIds([]);
  };
  
  return (
    <>
      <Helmet>
        <title>Your Wishlist | Kutuku</title>
        <meta name="description" content="View and manage your saved items in your wishlist" />
      </Helmet>
      
      <div className={cn(
        "py-8 min-h-[80vh]",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      )}>
        <Container>
          <PageHeading 
            title="Your Wishlist" 
            subtitle="Manage your saved items"
          />
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <EmptyState 
              title="Your wishlist is empty"
              description="Items you save will appear here"
              icon="heart"
              actionText="Discover Products"
              actionHref="/search"
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="select-all"
                    checked={selectedItemIds.length > 0 && selectedItemIds.length === wishlist.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <label htmlFor="select-all" className="text-sm">
                    {selectedItemIds.length === wishlist.length ? "Unselect All" : "Select All"}
                  </label>
                </div>
                
                {selectedItemIds.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveSelected}
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-300 border-gray-700" : ""
                      )}
                    >
                      <Trash className="h-3 w-3 mr-1" />
                      Remove Selected
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddSelectedToCart}
                      className={cn(
                        "text-xs",
                        isDarkMode && "bg-orange-600 hover:bg-orange-700"
                      )}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add Selected to Cart
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <input 
                        type="checkbox" 
                        checked={selectedItemIds.includes(product.id)}
                        onChange={() => handleSelectItem(product.id)}
                        className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                      />
                    </div>
                    <ProductCard
                      product={product}
                      isAddingToCart={isAddingToCart === product.id}
                      onRemoveFromWishlist={() => removeFromWishlist(product.id)}
                      showWishlistButton={false}
                      showRemoveButton={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default WishlistPage;
