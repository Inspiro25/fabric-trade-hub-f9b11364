
import React, { useState, useEffect } from 'react';
import { products } from '@/lib/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Search as SearchIcon, Sliders, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(products);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(products);
      return;
    }

    const filteredResults = products.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(filteredResults);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-700">
            <ArrowLeft size={22} />
          </Link>
          
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for products, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="kutuku-searchbar pr-10 pl-9 py-2.5 h-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-700">
            <Sliders size={20} />
          </Button>
        </div>
      </div>

      {/* Search Content */}
      <div className="p-4">
        {searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-gray-400">
              <SearchIcon size={48} />
            </div>
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs">
              We couldn't find any products matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  variant="compact" 
                  gridCols={2} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
