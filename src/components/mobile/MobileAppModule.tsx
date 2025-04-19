import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Download, ArrowRight, Smartphone } from 'lucide-react';

export const MobileAppModule: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-24">
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Shop on the go with Zalekart
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Download our mobile app for a seamless shopping experience. Get exclusive deals and shop anytime, anywhere.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" className="w-full sm:w-auto">
                <Download className="mr-2 h-5 w-5" />
                Download App
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl border-8 border-background bg-background shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary/20 to-background">
                <Smartphone className="h-24 w-24 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-lg bg-background p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 p-2">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Scan to download</p>
                  <p className="text-xs text-muted-foreground">Available on iOS & Android</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 