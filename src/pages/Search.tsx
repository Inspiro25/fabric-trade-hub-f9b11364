
import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/features/ProductGrid';
import { products } from '@/lib/products';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState(products);
  
  useEffect(() => {
    if (query) {
      const filteredProducts = products.filter(product => {
        return (
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
      });
      setSearchResults(filteredProducts);
      
      // Update URL with search query
      const params = new URLSearchParams();
      params.set('q', query);
      navigate(`/search?${params.toString()}`, { replace: true });
    } else {
      setSearchResults([]);
      navigate('/search', { replace: true });
    }
  }, [query, navigate]);
  
  const handleClear = () => {
    setQuery('');
  };
  
  return (
    <div className="animate-page-transition pb-16 md:pb-0">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-8 bg-muted/50"
              autoFocus
            />
            {query && (
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button variant="ghost" size="sm">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Search Results */}
        {query ? (
          searchResults.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Found {searchResults.length} results for "{query}"
              </div>
              <ProductGrid products={searchResults} />
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">No results found</h2>
              <p className="text-muted-foreground mb-6">Try using different keywords or browse our categories</p>
              <Button onClick={() => navigate('/')}>Browse Categories</Button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {['T-shirt', 'Jeans', 'Dress', 'Shoes', 'Jacket'].map((term) => (
                  <button 
                    key={term}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Browse Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Men', 'Women', 'Kids', 'Accessories', 'Footwear', 'Beauty'].map((category) => (
                  <button 
                    key={category}
                    className="p-3 border rounded-lg text-left flex items-center"
                    onClick={() => setQuery(category)}
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
