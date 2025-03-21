
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

// Mock offers data
const mockOffers = [
  {
    id: "offer1",
    title: "Summer Sale",
    description: "Get up to 50% off on summer collection",
    code: "SUMMER50",
    discount: 50,
    expiry: "2023-09-30",
    type: "percentage",
    shopId: "shop1",
    shopName: "Fashion Store",
    bannerImage: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VtbWVyJTIwc2FsZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "offer2",
    title: "New User Discount",
    description: "First time shopping? Get 20% off on your first order",
    code: "NEWUSER20",
    discount: 20,
    expiry: "2023-12-31",
    type: "percentage",
    shopId: "shop2",
    shopName: "Trendy Apparel",
    bannerImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "offer3",
    title: "Free Shipping",
    description: "Free shipping on orders above ₹599",
    code: "FREESHIP",
    discount: 0,
    expiry: "2023-10-15",
    type: "shipping",
    shopId: "shop3",
    shopName: "Home Essentials",
    bannerImage: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMHNoaXBwaW5nfGVufDB8fDB8fHww"
  },
  {
    id: "offer4",
    title: "Buy One Get One",
    description: "Buy one item and get another one free",
    code: "BOGO",
    discount: 100,
    expiry: "2023-09-15",
    type: "bogo",
    shopId: "shop4",
    shopName: "Sports & Fitness",
    bannerImage: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob3BwaW5nJTIwb2ZmZXJ8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "offer5",
    title: "Weekend Special",
    description: "25% off on all accessories every weekend",
    code: "WEEKEND25",
    discount: 25,
    expiry: "2023-11-30",
    type: "percentage",
    shopId: "shop1",
    shopName: "Fashion Store",
    bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
  }
];

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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockOffers.map((offer) => (
                      <Card key={offer.id} className="overflow-hidden border-none shadow-md">
                        <div className="aspect-[16/9] w-full overflow-hidden">
                          <img 
                            src={offer.bannerImage} 
                            alt={offer.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
                            {offer.type === "percentage" && (
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
                            By: {offer.shopName}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-3"
                            asChild
                          >
                            <Link to={`/shop/${offer.shopId}`}>
                              Shop Now
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                  {mockOffers.filter(offer => offer.type === "percentage").map((offer) => (
                    <Card key={offer.id} className="overflow-hidden border-none shadow-md">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
                          <div className="bg-red-100 text-red-600 rounded-full px-2 py-1 text-xs font-semibold flex items-center">
                            <Percent className="h-3 w-3 mr-1" />
                            {offer.discount}% OFF
                          </div>
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
                          By: {offer.shopName}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          asChild
                        >
                          <Link to={`/shop/${offer.shopId}`}>
                            Shop Now
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
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
