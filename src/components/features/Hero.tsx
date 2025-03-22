
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1471&auto=format&fit=crop" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-white"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full px-3 py-1 text-white mb-3">
              Summer Collection
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-2 leading-tight"
          >
            Your Perfect <span className="text-orange-400">Style</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 mb-4 text-sm"
          >
            Curated collections for comfort and elegance.
            {currentUser ? ` Welcome, ${currentUser.displayName?.split(' ')[0] || 'valued customer'}!` : ''}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 gap-2 rounded-full" asChild>
              <Link to="/new-arrivals">
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" asChild>
              <Link to="/trending">
                <Star className="h-4 w-4 mr-2" />
                Trending
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Quick Shop Categories */}
      <div className="absolute bottom-3 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            {['Women', 'Men', 'Kids', 'Beauty', 'Accessories'].map(cat => (
              <Link 
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="bg-white/90 backdrop-blur-sm shadow-sm rounded-full px-3 py-1 flex items-center gap-2 flex-shrink-0 hover:bg-orange-50 transition-colors"
              >
                <span className="font-medium text-xs">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
