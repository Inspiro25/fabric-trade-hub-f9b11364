
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=3272" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl">
          <div 
            className={`transition-all duration-500 delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="category-chip bg-primary text-primary-foreground mb-4">New Collection</span>
          </div>
          
          <h1 
            className={`heading-xl text-white mb-6 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Discover Your Perfect Style
          </h1>
          
          <p 
            className={`body-lg text-white/80 mb-8 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore our curated collection of premium clothing. From casual essentials to statement pieces, find your unique fashion expression.
          </p>
          
          <div 
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Button size="lg" asChild>
              <Link to="/#new-arrivals">
                Shop New Arrivals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/#categories">
                Explore Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Element */}
      <div 
        className={`absolute bottom-10 right-10 w-64 h-64 border border-white/20 rounded-full transition-all duration-1000 delay-1000 ${
          isLoaded ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
      />
      <div 
        className={`absolute bottom-10 right-10 w-32 h-32 border border-white/20 rounded-full transition-all duration-1000 delay-1200 ${
          isLoaded ? 'opacity-20 scale-100' : 'opacity-0 scale-50'
        }`}
      />
    </section>
  );
};

export default Hero;
