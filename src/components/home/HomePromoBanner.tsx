
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePromoBanner = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-lg bg-primary text-primary-foreground"
      >
        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Spring Collection 2024
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-6 max-w-md"
          >
            Discover our latest arrivals featuring fresh styles and vibrant colors for the new season.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="font-semibold"
            >
              <Link to="/products">
                Shop Now
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className={cn(
          "absolute -left-12 -top-12 w-40 h-40 rounded-full opacity-50",
          isDarkMode ? "bg-primary-foreground/10" : "bg-primary-foreground/20"
        )} />
        <div className={cn(
          "absolute -right-12 -bottom-12 w-40 h-40 rounded-full opacity-50",
          isDarkMode ? "bg-primary-foreground/10" : "bg-primary-foreground/20"
        )} />
      </motion.div>
    </div>
  );
};

export default HomePromoBanner;
