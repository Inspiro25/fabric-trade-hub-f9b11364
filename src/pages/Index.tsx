
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/features/Hero';
import ProductGrid from '@/components/features/ProductGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  getNewArrivals, 
  getTrendingProducts,
  getAllCategories
} from '@/lib/products';

const Index = () => {
  const newArrivals = getNewArrivals();
  const trendingProducts = getTrendingProducts();
  const categories = getAllCategories();

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="animate-page-transition">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* New Arrivals Section */}
        <section id="new-arrivals" className="py-20">
          <ProductGrid 
            products={newArrivals}
            title="New Arrivals"
            subtitle="Discover our latest additions to elevate your wardrobe"
          />
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/category/new-arrivals">
                View All New Arrivals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Feature Banner */}
        <section className="bg-accent py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="category-chip mb-4">Premium Quality</span>
                <h2 className="heading-lg mb-4">Crafted with Excellence</h2>
                <p className="body-md text-muted-foreground mb-6">
                  Our commitment to quality is evident in every stitch. We source the finest materials and partner with skilled artisans to create pieces that are not only stylish but built to last.
                </p>
                <Button asChild>
                  <Link to="/about">
                    Our Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072" 
                  alt="Premium Clothing" 
                  className="rounded-lg shadow-elevated object-cover h-[500px] w-full"
                />
                <div className="absolute -bottom-6 -left-6 p-6 glass-morphism rounded-lg shadow-elevated max-w-xs">
                  <p className="font-medium mb-1">Sustainable Materials</p>
                  <p className="text-sm text-muted-foreground">
                    We prioritize sustainability in our production process, using eco-friendly materials wherever possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section id="categories" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="heading-lg mb-3">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our carefully curated categories to find exactly what you're looking for
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div key={category} className="relative overflow-hidden rounded-lg group h-[300px]">
                  <img 
                    src={`https://source.unsplash.com/featured/?${category.toLowerCase()},fashion`}
                    alt={category} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{category}</h3>
                    <Button 
                      variant="outline" 
                      className="w-fit bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                      asChild
                    >
                      <Link to={`/category/${category.toLowerCase()}`}>
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Trending Section */}
        <section id="trending" className="py-20 bg-muted/50">
          <ProductGrid 
            products={trendingProducts}
            title="Trending Now"
            subtitle="The most popular styles that everyone's talking about"
          />
          
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
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=3271" 
              alt="Join Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="heading-lg mb-4">Join Our Community</h2>
              <p className="body-md mb-8">
                Sign up to receive early access to new arrivals, exclusive offers, and styling tips tailored to your preferences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-12 w-full rounded-md border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="lg" className="h-12">Subscribe</Button>
              </div>
              
              <p className="text-sm mt-4 text-white/60">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
