
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Percent, Tag, Clock, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '@/components/ui/ProductCard';
import { Offer, getActiveOffers } from '@/lib/supabase/offers';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/products/base';
import { Product } from '@/lib/types/product';

const Offers = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const { data: offers = [], isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: getActiveOffers,
  });

  // Fetch products when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        // Filter products with sale price for the featured deals section
        const discounted = products.filter(product => product.salePrice).slice(0, 8);
        setDiscountedProducts(discounted);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    
    loadProducts();
  }, []);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/80 to-white">
      <Navbar />
      
      <main className={`pt-16 pb-20 ${isMobile ? 'px-3' : 'px-4'}`}>
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center mb-4 mt-4">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="mr-2 h-8 w-8"
            >
              <Link to="/" aria-label="Back to home">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Special Offers</h1>
          </div>
          <p className="text-muted-foreground mb-6 ml-10">Discover great deals and discounts on your favorite products</p>
          
          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-3 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg text-xs md:text-sm">All</TabsTrigger>
                <TabsTrigger value="deals" className="rounded-lg text-xs md:text-sm">Deals</TabsTrigger>
                <TabsTrigger value="coupons" className="rounded-lg text-xs md:text-sm">Coupons</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-8">
                <section className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Featured Deals</h2>
                    {discountedProducts.length > 4 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        className="text-sm text-primary"
                      >
                        <Link to="/search?discount=true">
                          View all
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  {discountedProducts.length > 0 ? (
                    <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
                      {discountedProducts.slice(0, isMobile ? 2 : 4).map((product) => (
                        <ProductCard key={product.id} product={product} variant={isMobile ? "compact" : undefined} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No featured deals available at the moment.</p>
                    </div>
                  )}
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-4">Available Offers</h2>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="animate-pulse space-y-4 w-full">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-gray-200 h-40 rounded-xl w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                      <p className="text-red-500 mb-2">Error loading offers</p>
                      <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                      <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No offers available at the moment.</p>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                      {offers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
                          {offer.banner_image && (
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                              <img 
                                src={offer.banner_image} 
                                alt={offer.title} 
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              {offer.type === "percentage" && offer.discount && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                                  <Percent className="h-3 w-3 mr-1" />
                                  {offer.discount}% OFF
                                </div>
                              )}
                            </div>
                          )}
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
                              {!offer.banner_image && (
                                <>
                                  {offer.type === "percentage" && offer.discount && (
                                    <div className="bg-red-100 text-red-600 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                                      <Percent className="h-3 w-3 mr-1" />
                                      {offer.discount}% OFF
                                    </div>
                                  )}
                                  {offer.type === "shipping" && (
                                    <div className="bg-green-100 text-green-600 rounded-full px-2 py-1 text-xs font-semibold">
                                      Free Shipping
                                    </div>
                                  )}
                                  {offer.type === "bogo" && (
                                    <div className="bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs font-semibold">
                                      Buy 1 Get 1
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{offer.description}</p>
                            
                            <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {offer.code}
                                </code>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires: {formatDate(offer.expiry)}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-muted-foreground">
                                By: {offer.shops?.name || "Platform"}
                              </div>
                              {offer.shop_id && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary p-0 h-auto hover:bg-transparent hover:text-primary/80"
                                  asChild
                                >
                                  <Link to={`/shop/${offer.shop_id}`}>
                                    Shop Now
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>
              
              <TabsContent value="deals">
                {discountedProducts.length > 0 ? (
                  <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
                    {discountedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} variant={isMobile ? "compact" : undefined} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No deals available at the moment.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="coupons">
                <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                  {offers
                    .filter(offer => offer.type === "percentage")
                    .map((offer) => (
                    <Card key={offer.id} className="overflow-hidden border border-gray-100 shadow-sm">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
                          {offer.discount && (
                            <div className="bg-red-100 text-red-600 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                              <Percent className="h-3 w-3 mr-1" />
                              {offer.discount}% OFF
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{offer.description}</p>
                        
                        <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {offer.code}
                            </code>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires: {formatDate(offer.expiry)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-muted-foreground">
                            By: {offer.shops?.name || "Platform"}
                          </div>
                          {offer.shop_id && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary p-0 h-auto hover:bg-transparent hover:text-primary/80"
                              asChild
                            >
                              <Link to={`/shop/${offer.shop_id}`}>
                                Shop Now
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {offers.filter(offer => offer.type === "percentage").length === 0 && (
                    <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm">
                      <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No coupons available at the moment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Offers;
