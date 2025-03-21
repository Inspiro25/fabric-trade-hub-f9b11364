
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Percent, Tag, Clock, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { mockProducts } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { Offer, getActiveOffers } from '@/lib/supabase/offers';
import { useQuery } from '@tanstack/react-query';

// Filter some mock products as featured offers
const featuredProducts = mockProducts
  .filter((product) => product.salePrice)
  .slice(0, 8);

const Offers = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  
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
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Special Offers</h1>
          <p className="text-muted-foreground mb-6">Discover great deals and discounts on your favorite products</p>
          
          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Offers</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="clearance">Clearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {/* Featured deals section */}
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Featured Deals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
                
                {/* Promo cards */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Available Offers</h2>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <p className="text-muted-foreground">Loading offers...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">Error loading offers</p>
                      <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                        Try Again
                      </Button>
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No offers available at the moment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {offers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden border-none shadow-md">
                          {offer.banner_image && (
                            <div className="aspect-[16/9] w-full overflow-hidden">
                              <img 
                                src={offer.banner_image} 
                                alt={offer.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
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
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                            <div className="flex items-center justify-between">
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
                            <div className="mt-3 text-xs text-muted-foreground">
                              By: {offer.shops?.name || "Platform"}
                            </div>
                            {offer.shop_id && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-3"
                                asChild
                              >
                                <Link to={`/shop/${offer.shop_id}`}>
                                  Shop Now
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </TabsContent>
              
              <TabsContent value="deals">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="coupons">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers
                    .filter(offer => offer.type === "percentage")
                    .map((offer) => (
                    <Card key={offer.id} className="overflow-hidden border-none shadow-md">
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
                        <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                        <div className="flex items-center justify-between">
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
                        <div className="mt-3 text-xs text-muted-foreground">
                          By: {offer.shops?.name || "Platform"}
                        </div>
                        {offer.shop_id && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3"
                            asChild
                          >
                            <Link to={`/shop/${offer.shop_id}`}>
                              Shop Now
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="clearance">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No clearance sales available at the moment.</p>
                  <Button asChild className="mt-4">
                    <Link to="/">Continue Shopping</Link>
                  </Button>
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
