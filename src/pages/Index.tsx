import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/features/Hero';
import ProductGrid from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getNewArrivals, getTrendingProducts, getAllCategories, getTopRatedProducts, getDiscountedProducts, getBestSellingProducts } from '@/lib/products';
const Index = () => {
  const newArrivals = getNewArrivals();
  const trendingProducts = getTrendingProducts();
  const topRatedProducts = getTopRatedProducts();
  const discountedProducts = getDiscountedProducts();
  const bestSellers = getBestSellingProducts();
  const categories = getAllCategories();

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);
  return <div className="animate-page-transition">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Category Icons */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <Carousel className="mx-auto max-w-5xl">
              <CarouselContent>
                {categories.map(category => <CarouselItem key={category} className="basis-1/2 sm:basis-1/3 md:basis-1/5">
                    <Link to={`/category/${category.toLowerCase()}`} className="flex flex-col items-center gap-2 p-4 text-center hover:text-primary transition-colors">
                      <div className="w-20 h-20 rounded-full bg-background shadow-subtle flex items-center justify-center mb-2">
                        <img src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`} alt={category} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <span className="text-sm font-medium">{category}</span>
                    </Link>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </section>
        
        {/* New Arrivals Section */}
        <section id="new-arrivals" className="py-[10px]">
          <ProductGrid products={newArrivals} title="New Arrivals" subtitle="Discover our latest additions to elevate your wardrobe" />
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/category/new-arrivals">
                View All New Arrivals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Deal of the Day */}
        <section className="bg-accent/20 py-[10px]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="heading-lg mb-3">Deal of the Day</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Limited time offers on premium styles. Don't miss out!
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
              <div>
                <img src="https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1974" alt="Deal of the Day" className="rounded-lg object-cover w-full h-[500px]" />
              </div>
              <div className="p-6 md:p-10">
                <span className="badge bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  SPECIAL OFFER
                </span>
                <h3 className="text-3xl font-bold mb-4">Summer Collection</h3>
                <p className="text-xl mb-2"><span className="line-through text-muted-foreground">$199.99</span> <span className="font-bold">$129.99</span></p>
                <p className="text-sm text-muted-foreground mb-6">Limited stock available. Offer ends in:</p>
                
                <div className="flex gap-4 mb-8">
                  <div className="bg-background p-3 rounded-lg text-center min-w-16">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="bg-background p-3 rounded-lg text-center min-w-16">
                    <div className="text-2xl font-bold">56</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="bg-background p-3 rounded-lg text-center min-w-16">
                    <div className="text-2xl font-bold">13</div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button size="lg" className="w-full">Shop Now</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Best Sellers Section */}
        <section className="py-[10px]">
          <ProductGrid products={bestSellers} title="Best Sellers" subtitle="Our most popular styles loved by customers" />
        </section>
        
        {/* Trust Badges */}
        
        
        {/* Feature Banner */}
        
        
        {/* Top Rated Products */}
        <section className="py-[20px]">
          <ProductGrid products={topRatedProducts} title="Top Rated Products" subtitle="Highly rated by our satisfied customers" />
        </section>
        
        {/* Categories Section */}
        <section id="categories" className="bg-muted/50 py-[15px]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="heading-lg mb-3">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our carefully curated categories to find exactly what you're looking for
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => <div key={category} className="relative overflow-hidden rounded-lg group h-[300px]">
                  <img src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`} alt={category} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{category}</h3>
                    <Button variant="outline" className="w-fit bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
                      <Link to={`/category/${category.toLowerCase()}`}>
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>)}
            </div>
          </div>
        </section>
        
        {/* Discounted Products */}
        <section className="py-[15px]">
          <ProductGrid products={discountedProducts} title="On Sale" subtitle="Great styles at discounted prices" />
        </section>
        
        {/* Trending Section */}
        <section id="trending" className="bg-muted/50 py-[15px]">
          <ProductGrid products={trendingProducts} title="Trending Now" subtitle="The most popular styles that everyone's talking about" />
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/category/trending">
                View All Trending Items
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Join Banner */}
        
      </main>
      
      <Footer />
    </div>;
};
export default Index;