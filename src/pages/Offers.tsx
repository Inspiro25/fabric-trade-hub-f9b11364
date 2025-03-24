import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/lib/types/product';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/use-media-query';

const Offers = () => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [highlightedProducts, setHighlightedProducts] = useState<Product[]>([]);
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const now = new Date();
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .in('type', ['discount', 'sale'])
          .gte('expiry', now.toISOString())
          .order('expiry', { ascending: true });
        
        if (error) {
          console.error('Error fetching active offers:', error);
          setError('Failed to load offers');
          return;
        }
        
        if (data) {
          setActiveOffers(data);
          
          // Select the first offer and highlight its products
          if (data.length > 0) {
            setSelectedOffer(data[0]);
            highlightOfferProducts(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err);
        setError('Failed to load offers');
      }
    };
    
    fetchOffers();
  }, []);

  const highlightOfferProducts = async (offer: any) => {
    if (!offer || !offer.product_ids) {
      setHighlightedProducts([]);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', offer.product_ids);
      
      if (error) {
        console.error('Error fetching products for offer:', error);
        setError('Failed to load products for offer');
        return;
      }
      
      if (data) {
        setHighlightedProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products for offer:', err);
      setError('Failed to load products for offer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('products')
          .select('*');
        
        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }
        
        if (sortBy === 'price') {
          query = query.order('price', { ascending: sortOrder === 'asc' });
        } else if (sortBy === 'rating') {
          query = query.order('rating', { ascending: sortOrder === 'desc' });
        } else if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching products:', error);
          setError('Failed to load products');
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchTerm, sortBy, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    highlightOfferProducts(offer);
  };

  return (
    <>
      <Helmet>
        <title>Offers & Discounts</title>
        <meta name="description" content="Find the best deals and discounts on our products." />
      </Helmet>

      <div className={cn("min-h-screen py-12", isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50")}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">
            Exclusive Offers & Discounts
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-3 py-2 rounded-md w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" onClick={toggleSortOrder} />
                  ) : (
                    <SortDesc className="h-4 w-4" onClick={toggleSortOrder} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Offers Section */}
            <div className="md:col-span-1">
              <Card className={cn(
                "mb-6",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Active Offers</h3>
                  <ul className="space-y-2">
                    {activeOffers.map(offer => (
                      <li
                        key={offer.id}
                        className={cn(
                          "cursor-pointer p-2 rounded-md hover:bg-gray-100",
                          isDarkMode ? "hover:bg-gray-700" : "",
                          selectedOffer?.id === offer.id ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                        )}
                        onClick={() => handleOfferClick(offer)}
                      >
                        {offer.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Highlighted Products Section */}
            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">
                {selectedOffer ? selectedOffer.title : 'All Products'}
              </h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-20 mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-8 border rounded-lg">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {highlightedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      salePrice={product.salePrice}
                      image={product.images[0]}
                      category={product.category}
                      isNew={product.isNew}
                      isTrending={product.isTrending}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      variant="compact"
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Offers;
