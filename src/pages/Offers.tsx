import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Percent, Tag, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '@/components/ui/ProductCard';
import { Offer, getActiveOffers } from '@/lib/supabase/offers';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/products/base';
import { Product } from '@/lib/types/product';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Offers = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const { isDarkMode } = useTheme();
  
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
    <div className={cn(
      "min-h-screen",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-blue-50/80 to-white"
    )}>
      <main className={`${isMobile ? 'pt-4 px-4' : 'pt-6 px-6'} pb-16`}>
        <div className="container mx-auto max-w-7xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className={cn(
              "mb-3 w-full grid grid-cols-3 p-1 rounded-xl",
              isDarkMode && "bg-gray-800 border border-gray-700"
            )}>
              <TabsTrigger 
                value="all" 
                className={cn(
                  "rounded-lg text-xs md:text-sm",
                  isDarkMode && "data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                )}
              >All</TabsTrigger>
              <TabsTrigger 
                value="deals" 
                className={cn(
                  "rounded-lg text-xs md:text-sm",
                  isDarkMode && "data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                )}
              >Deals</TabsTrigger>
              <TabsTrigger 
                value="coupons" 
                className={cn(
                  "rounded-lg text-xs md:text-sm",
                  isDarkMode && "data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
                )}
              >Coupons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-3">
              <section className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className={cn(
                    "text-lg md:text-xl font-semibold",
                    isDarkMode && "text-white"
                  )}>Featured Deals</h2>
                  {discountedProducts.length > 4 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-primary"
                      )}
                    >
                      <Link to="/search?discount=true">
                        View all
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
                {discountedProducts.length > 0 ? (
                  <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
                    {discountedProducts.slice(0, isMobile ? 2 : 4).map((product) => (
                      <ProductCard key={product.id} product={product} variant={isMobile ? "compact" : undefined} />
                    ))}
                  </div>
                ) : (
                  <div className={cn(
                    "text-center py-10 rounded-xl shadow-sm",
                    isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white"
                  )}>
                    <ShoppingBag className={cn(
                      "h-12 w-12 mx-auto mb-4 opacity-50",
                      isDarkMode ? "text-gray-500" : "text-muted-foreground"
                    )} />
                    <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>No featured deals available at the moment.</p>
                  </div>
                )}
              </section>
              
              <section>
                <h2 className={cn(
                  "text-lg md:text-xl font-semibold mb-2",
                  isDarkMode && "text-white"
                )}>Available Offers</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-pulse space-y-4 w-full">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={cn(
                          "h-40 rounded-xl w-full",
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        )}></div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className={cn(
                    "text-center py-10 rounded-xl shadow-sm",
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  )}>
                    <p className={cn(
                      "mb-2",
                      isDarkMode ? "text-red-400" : "text-red-500"
                    )}>Error loading offers</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                      className={isDarkMode && "border-gray-600 text-gray-200 hover:bg-gray-700"}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : offers.length === 0 ? (
                  <div className={cn(
                    "text-center py-10 rounded-xl shadow-sm",
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  )}>
                    <Tag className={cn(
                      "h-12 w-12 mx-auto mb-4 opacity-50",
                      isDarkMode ? "text-gray-500" : "text-muted-foreground"
                    )} />
                    <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>No offers available at the moment.</p>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                    {offers.map((offer) => (
                      <Card key={offer.id} className={cn(
                        "overflow-hidden transition-all duration-300 hover:shadow-md",
                        isDarkMode 
                          ? "bg-gray-800 border-gray-700" 
                          : "border border-gray-100 shadow-sm"
                      )}>
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
                        <CardHeader className="p-3 pb-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className={cn(
                              "text-base md:text-lg font-semibold",
                              isDarkMode && "text-white"
                            )}>{offer.title}</CardTitle>
                            {!offer.banner_image && (
                              <>
                                {offer.type === "percentage" && offer.discount && (
                                  <div className={cn(
                                    "rounded-full px-2 py-1 text-xs font-semibold flex items-center",
                                    isDarkMode 
                                      ? "bg-red-900/40 text-red-300" 
                                      : "bg-red-100 text-red-600"
                                  )}>
                                    <Percent className="h-3 w-3 mr-1" />
                                    {offer.discount}% OFF
                                  </div>
                                )}
                                {offer.type === "shipping" && (
                                  <div className={cn(
                                    "rounded-full px-2 py-1 text-xs font-semibold",
                                    isDarkMode 
                                      ? "bg-green-900/40 text-green-300" 
                                      : "bg-green-100 text-green-600"
                                  )}>
                                    Free Shipping
                                  </div>
                                )}
                                {offer.type === "bogo" && (
                                  <div className={cn(
                                    "rounded-full px-2 py-1 text-xs font-semibold",
                                    isDarkMode 
                                      ? "bg-blue-900/40 text-blue-300" 
                                      : "bg-blue-100 text-blue-600"
                                  )}>
                                    Buy 1 Get 1
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-1">
                          <p className={cn(
                            "text-xs md:text-sm mb-2 line-clamp-2",
                            isDarkMode ? "text-gray-300" : "text-muted-foreground"
                          )}>{offer.description}</p>
                          
                          <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Tag className={cn(
                                "h-4 w-4 mr-1",
                                isDarkMode ? "text-gray-400" : "text-muted-foreground"
                              )} />
                              <code className={cn(
                                "px-2 py-1 rounded text-xs font-mono",
                                isDarkMode ? "bg-gray-700" : "bg-gray-100"
                              )}>
                                {offer.code}
                              </code>
                            </div>
                            <div className={cn(
                              "flex items-center text-xs",
                              isDarkMode ? "text-gray-400" : "text-muted-foreground"
                            )}>
                              <Clock className="h-3 w-3 mr-1" />
                              Expires: {formatDate(offer.expiry)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className={cn(
                              "text-xs",
                              isDarkMode ? "text-gray-400" : "text-muted-foreground"
                            )}>
                              By: {offer.shops?.name || "Platform"}
                            </div>
                            {offer.shop_id && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                  "p-0 h-auto hover:bg-transparent",
                                  isDarkMode 
                                    ? "text-blue-400 hover:text-blue-300" 
                                    : "text-primary hover:text-primary/80"
                                )}
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
                <div className={`grid grid-cols-2 ${isMobile ? 'gap-2' : 'md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
                  {discountedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant={isMobile ? "compact" : undefined} />
                  ))}
                </div>
              ) : (
                <div className={cn(
                  "text-center py-10 rounded-xl shadow-sm",
                  isDarkMode ? "bg-gray-800" : "bg-white"
                )}>
                  <ShoppingBag className={cn(
                    "h-12 w-12 mx-auto mb-4 opacity-50",
                    isDarkMode ? "text-gray-500" : "text-muted-foreground"
                  )} />
                  <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>No deals available at the moment.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="coupons">
              <div className={`grid grid-cols-1 ${isMobile ? 'gap-2' : 'md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
                {offers
                  .filter(offer => offer.type === "percentage")
                  .map((offer) => (
                  <Card key={offer.id} className={cn(
                    "overflow-hidden shadow-sm",
                    isDarkMode 
                      ? "bg-gray-800 border-gray-700" 
                      : "border border-gray-100"
                  )}>
                    <CardHeader className="p-3 pb-1">
                      <div className="flex justify-between items-start">
                        <CardTitle className={cn(
                          "text-base md:text-lg font-semibold",
                          isDarkMode && "text-white"
                        )}>{offer.title}</CardTitle>
                        {offer.discount && (
                          <div className={cn(
                            "rounded-full px-2 py-1 text-xs font-semibold flex items-center",
                            isDarkMode 
                              ? "bg-red-900/40 text-red-300" 
                              : "bg-red-100 text-red-600"
                          )}>
                            <Percent className="h-3 w-3 mr-1" />
                            {offer.discount}% OFF
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className={cn(
                        "text-xs md:text-sm mb-2 line-clamp-2",
                        isDarkMode ? "text-gray-300" : "text-muted-foreground"
                      )}>{offer.description}</p>
                      
                      <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Tag className={cn(
                            "h-4 w-4 mr-1",
                            isDarkMode ? "text-gray-400" : "text-muted-foreground"
                          )} />
                          <code className={cn(
                            "px-2 py-1 rounded text-xs font-mono",
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          )}>
                            {offer.code}
                          </code>
                        </div>
                        <div className={cn(
                          "flex items-center text-xs",
                          isDarkMode ? "text-gray-400" : "text-muted-foreground"
                        )}>
                          <Clock className="h-3 w-3 mr-1" />
                          Expires: {formatDate(offer.expiry)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className={cn(
                          "text-xs",
                          isDarkMode ? "text-gray-400" : "text-muted-foreground"
                        )}>
                          By: {offer.shops?.name || "Platform"}
                        </div>
                        {offer.shop_id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "p-0 h-auto hover:bg-transparent",
                              isDarkMode 
                                ? "text-blue-400 hover:text-blue-300" 
                                : "text-primary hover:text-primary/80"
                            )}
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
                  <div className={cn(
                    "col-span-full text-center py-10 rounded-xl shadow-sm",
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  )}>
                    <Tag className={cn(
                      "h-12 w-12 mx-auto mb-4 opacity-50",
                      isDarkMode ? "text-gray-500" : "text-muted-foreground"
                    )} />
                    <p className={isDarkMode ? "text-gray-400" : "text-muted-foreground"}>No coupons available at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Offers;
