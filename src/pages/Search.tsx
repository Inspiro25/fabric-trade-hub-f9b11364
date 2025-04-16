
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchData } from '@/hooks/use-search-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const { products, loading } = useSearchData(query);
  const { categories } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategories.length === 0 || 
      selectedCategories.includes(product.category_id || '')
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
      }
    });

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Input
            type="search"
            placeholder="Search for products..."
            className="max-w-2xl w-full text-base border-blue-500 dark:border-blue-400"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden mb-4">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <FiltersSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </SheetContent>
          </Sheet>

          <div className="hidden md:block w-64 flex-shrink-0">
            <FiltersSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                {query ? `Results for "${query}"` : 'All Products'}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  ({filteredProducts.length} products)
                </span>
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin text-blue-500">Loading...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      salePrice={product.sale_price || null}
                      image={product.images?.[0] || '/placeholder.svg'}
                      category={product.category_id || ''}
                      isNew={product.is_new || false}
                      isTrending={product.is_trending || false}
                      rating={product.rating || 0}
                      reviewCount={product.review_count || 0}
                      className="h-full"
                      onClick={() => handleProductClick(product.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltersSidebar({ categories, selectedCategories, setSelectedCategories, sortBy, setSortBy }) {
  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div>
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Categories</h3>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(prev =>
                    checked
                      ? [...prev, category.id]
                      : prev.filter(id => id !== category.id)
                  );
                }}
                className="border-gray-400 dark:border-gray-600"
              />
              <label
                htmlFor={category.id}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategories([])}
          className="w-full text-blue-500 dark:text-blue-400"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
