import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Product, adaptProduct } from '@/lib/products/types';
import { Shop } from '@/lib/shops/types';
import { fetchProducts } from '@/lib/supabase/products';
import { fetchShops } from '@/lib/supabase/shops';
import ProductCard from '@/components/products/ProductCard';
import ShopCard from '@/components/shops/ShopCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Search as SearchIcon, Filter, Grid, List } from 'lucide-react';

const Search: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isGrid, setIsGrid] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableRatings, setAvailableRatings] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleGridToggle = () => {
    setIsGrid(!isGrid);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilters(prevFilters =>
      prevFilters.includes(category)
        ? prevFilters.filter(filter => filter !== category)
        : [...prevFilters, category]
    );
  };

  const handleRatingFilterChange = (rating: number) => {
    setRatingFilters(prevFilters =>
      prevFilters.includes(rating)
        ? prevFilters.filter(filter => filter !== rating)
        : [...prevFilters, rating]
    );
  };

  const fetchSearchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = searchParams.get('q') || '';
      setSearchQuery(query);

      const fetchedProducts = await fetchProducts({ query });
      const fetchedShops = await fetchShops();

      // Apply filters
      const filteredProducts = fetchedProducts.filter(product => {
        const price = product.salePrice !== null && product.salePrice !== undefined ? product.salePrice : product.price;
        const isWithinPriceRange = price >= priceRange[0] && price <= priceRange[1];
        const isCategoryMatch = categoryFilters.length === 0 || categoryFilters.includes(product.category_id);
        const isRatingMatch = ratingFilters.length === 0 || ratingFilters.some(rating => product.rating >= rating);

        return isWithinPriceRange && isCategoryMatch && isRatingMatch;
      });

      setProducts(filteredProducts);
      setShops(fetchedShops.filter(shop => shop.name.toLowerCase().includes(query.toLowerCase())));

      // Extract available categories and ratings from the fetched products
      const categories = [...new Set(fetchedProducts.map(product => product.category_id))];
      const ratings = [...new Set(fetchedProducts.map(product => Math.floor(product.rating)))];

      setAvailableCategories(categories);
      setAvailableRatings(ratings.map(Number).sort((a, b) => b - a)); // Sort ratings in descending order
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, priceRange, categoryFilters, ratingFilters]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  useEffect(() => {
    const isGridParam = searchParams.get('grid');
    setIsGrid(isGridParam === null || isGridParam === 'true');
  }, [searchParams]);

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    const newParams = new URLSearchParams(searchParams);
    if (newQuery) {
      newParams.set('q', newQuery);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setCategoryFilters([]);
    setRatingFilters([]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products and shops..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleToggleFilter}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleGridToggle}>
            {isGrid ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex">
       {isFilterOpen && (
          <Card className="w-full md:w-1/4 mr-4">
            <CardHeader>
              <CardTitle>Filter Options</CardTitle>
              <CardDescription>Customize your search results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-bold mb-2">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <span>${priceRange[0]}</span>
                  <Slider
                    defaultValue={priceRange}
                    max={1000}
                    step={10}
                    onValueChange={handlePriceChange}
                  />
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold mb-2">Categories</h4>
                <div className="flex flex-col space-y-2">
                  {availableCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={categoryFilters.includes(category)}
                        onCheckedChange={() => handleCategoryFilterChange(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold mb-2">Customer Ratings</h4>
                <div className="flex flex-col space-y-2">
                  {availableRatings.map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={ratingFilters.includes(rating)}
                        onCheckedChange={() => handleRatingFilterChange(rating)}
                      />
                      <Label htmlFor={`rating-${rating}`} className="text-sm">
                        {rating} stars & up
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        )}

        <div className="w-full md:w-3/4">
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">Products <Badge className="ml-2">{products.length}</Badge></TabsTrigger>
              <TabsTrigger value="shops">Shops <Badge className="ml-2">{shops.length}</Badge></TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="pt-4">
              {isLoading ? (
                <div className="text-center">Loading products...</div>
              ) : products.length > 0 ? (
                <div className={cn("grid gap-4", isGrid ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1")}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} isGrid={isGrid} />
                  ))}
                </div>
              ) : (
                <div className="text-center">No products found matching your search criteria.</div>
              )}
            </TabsContent>
            <TabsContent value="shops" className="pt-4">
              {isLoading ? (
                <div className="text-center">Loading shops...</div>
              ) : shops.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              ) : (
                <div className="text-center">No shops found matching your search criteria.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Search;
