import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ElectronicsShowcase = () => {
  const { isDarkMode } = useTheme();
  
  const categories = [
    {
      id: 1,
      title: "Laptops & Computers",
      icon: <Laptop className="h-4 w-4" />,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300&auto=format&fit=crop",
      link: "/category/laptops"
    },
    {
      id: 2,
      title: "Audio & Accessories",
      icon: <Smartphone className="h-4 w-4" />,
      image: "https://images.unsplash.com/photo-1546027658-7aa750153465?q=80&w=300&auto=format&fit=crop",
      link: "/category/audio"
    },
    {
      id: 3,
      title: "Smart Home",
      icon: <Laptop className="h-4 w-4" />,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop",
      link: "/category/smart-home"
    },
    {
      id: 4,
      title: "Gaming",
      icon: <Smartphone className="h-4 w-4" />,
      image: "https://images.unsplash.com/photo-1580327344541-c86c16a013e7?q=80&w=300&auto=format&fit=crop",
      link: "/category/gaming"
    }
  ];

  return (
    <AnimatedGradient 
      hue="blue" 
      intensity="soft" 
      className={cn(
        "py-6 md:py-10 rounded-xl mx-4",
        isDarkMode ? "bg-gray-900/60" : ""
      )}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold mb-3 text-center md:text-left",
            isDarkMode && "text-gray-100"
          )}>
            Electronics & More
          </h2>
          <p className={cn(
            "mb-6 text-center md:text-left",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Discover our wide range of electronics and gadgets
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className={cn(
                "bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group",
                isDarkMode && "bg-gray-800"
              )}
            >
              <Link to={category.link} className="block">
                <div className="overflow-hidden rounded-md mb-2 aspect-square">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className={cn(
                  "font-medium text-sm truncate",
                  isDarkMode && "text-gray-200"
                )}>
                  {category.title}
                </h3>
                <p className={cn(
                  "text-blue-500 text-xs flex items-center mt-1 group-hover:font-medium",
                  isDarkMode && "text-blue-400"
                )}>
                  Shop Now 
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:ml-2 transition-all" />
                  </motion.span>
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center gap-3">
          <Button 
            className={cn(
              "bg-blue-500 hover:bg-blue-600",
              isDarkMode && "bg-blue-600 hover:bg-blue-700"
            )} 
            asChild
          >
            <Link to="/category/electronics">
              <Laptop className="h-4 w-4 mr-2" />
              All Electronics
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className={cn(
              "border-blue-200",
              isDarkMode && "border-gray-700 text-gray-200 hover:bg-gray-800"
            )} 
            asChild
          >
            <Link to="/category/smartphones">
              <Smartphone className="h-4 w-4 mr-2" />
              Smartphones
            </Link>
          </Button>
        </div>
      </div>
    </AnimatedGradient>
  );
};

export default ElectronicsShowcase;
