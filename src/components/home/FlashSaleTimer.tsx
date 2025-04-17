
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Percent, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newMinutes -= 1;
          if (newMinutes < 0) {
            newHours -= 1;
            newMinutes = 59;
          }
          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: 59
          };
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative py-3 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-95"></div>
      
      {/* Animated particles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-5 right-5 w-10 h-10 bg-yellow-300/30 rounded-full blur-md"
        ></motion.div>
        <motion.div 
          animate={{ 
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2] 
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-3 left-1/4 w-16 h-16 bg-white/20 rounded-full blur-lg"
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="md:w-auto flex items-center">
            <div className="mr-2 bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
              <Flame className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center">
                FLASH SALE
                <Zap className="h-3 w-3 ml-1 text-yellow-300 animate-pulse" />
              </h2>
              <p className="text-white/80 text-xs">Limited time offers!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Timer blocks with animations */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-white rounded-md p-1 w-10 font-mono font-bold text-sm text-orange-600 border-b-2 border-orange-300 shadow-inner">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <span className="text-[9px] text-white font-medium mt-0.5 block">HRS</span>
            </motion.div>
            <span className="text-sm font-bold text-white">:</span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white rounded-md p-1 w-10 font-mono font-bold text-sm text-orange-600 border-b-2 border-orange-300 shadow-inner">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-[9px] text-white font-medium mt-0.5 block">MIN</span>
            </motion.div>
            <span className="text-sm font-bold text-white">:</span>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-white rounded-md p-1 w-10 font-mono font-bold text-sm text-orange-600 border-b-2 border-orange-300 shadow-inner">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-[9px] text-white font-medium mt-0.5 block">SEC</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 transition-colors shadow-md border-b-2 border-orange-200 font-bold text-xs py-1 px-3 group" asChild>
              <Link to="/flash-sale" className="flex items-center">
                SHOP NOW 
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
