
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Star, Sparkles, Search } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function HomeHero() {
  const controls = useAnimation();
  
  useEffect(() => {
    // Start animation sequence when component mounts
    const animateSequence = async () => {
      await controls.start('visible');
    };
    
    animateSequence();
  }, [controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Decorative styles
  const decoBubble = "absolute rounded-full bg-orange-300/20 animate-pulse-subtle";
  
  return (
    <section className="relative bg-gradient-to-r from-orange-50 via-orange-100/40 to-white py-6 md:py-10 overflow-hidden">
      {/* Decorative elements */}
      <div className={cn(decoBubble, "w-32 h-32 -top-10 right-10")}></div>
      <div className={cn(decoBubble, "w-16 h-16 bottom-8 left-8")}></div>
      <div className={cn(decoBubble, "w-24 h-24 -bottom-10 right-20")}></div>
      <Sparkles className="absolute top-10 left-1/4 text-orange-300 h-4 w-4 animate-float" />
      <Sparkles className="absolute bottom-16 right-1/3 text-orange-400 h-5 w-5 animate-float" />
      
      <div className="container px-4 mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col md:flex-row items-center"
        >
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center bg-orange-100 text-orange-600 rounded-full px-3 py-1 text-xs font-medium mb-3"
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Fresh Arrivals
            </motion.span>
            
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 relative"
            >
              Discover Your <span className="text-orange-500">Style</span>
              <div className="absolute -right-4 -top-3 rotate-12 text-orange-400 opacity-20 text-5xl font-serif">✨</div>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-5 text-sm md:text-base"
            >
              Explore our curated collections for every occasion. Find premium fashion that expresses your unique personality.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-md" asChild>
                <Link to="/new-arrivals">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Now
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-orange-200 hover:bg-orange-100 transition-all" asChild>
                <Link to="/trending">
                  <Star className="mr-2 h-4 w-4 text-orange-500" />
                  Trending
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative z-10"
            >
              <div className="relative overflow-hidden rounded-xl shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1470" 
                  alt="Fashion collection" 
                  className="w-full h-auto rounded-xl object-cover"
                  loading="eager"
                  style={{ maxHeight: "400px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
                
                {/* Floating quick action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Button size="icon" className="rounded-full bg-white/80 backdrop-blur-sm text-orange-500 hover:bg-white" asChild>
                      <Link to="/search">
                        <Search className="h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Category pills */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute -bottom-4 left-0 right-0 flex justify-center"
              >
                <div className="flex gap-2 backdrop-blur-md bg-white/80 p-2 rounded-full shadow-md">
                  {['Summer', 'Casual', 'Office', 'Party'].map((tag, i) => (
                    <Link 
                      key={tag} 
                      to={`/category/${tag.toLowerCase()}`}
                      className="text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Decorative shapes */}
            <div className="absolute top-6 -right-6 w-16 h-16 rounded-full border-2 border-orange-200 z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border-2 border-orange-200 z-0"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
