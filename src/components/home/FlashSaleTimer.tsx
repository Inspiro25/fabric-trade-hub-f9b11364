import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Percent, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function FlashSaleTimer() {
  const { isDarkMode } = useTheme();
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
      <div className={cn(
        "absolute inset-0 opacity-95",
        isDarkMode 
          ? "bg-gradient-to-r from-blue-700 to-blue-600" 
          : "bg-gradient-to-r from-blue-600 to-blue-500"
      )}></div>
      
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
          className={cn(
            "absolute -top-10 -left-10 w-20 h-20 rounded-full blur-xl",
            isDarkMode ? "bg-blue-400/20" : "bg-white/20"
          )}
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
          className={cn(
            "absolute top-5 right-5 w-10 h-10 rounded-full blur-md",
            isDarkMode ? "bg-blue-400/30" : "bg-blue-300/30"
          )}
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
          className={cn(
            "absolute bottom-3 left-1/4 w-16 h-16 rounded-full blur-lg",
            isDarkMode ? "bg-blue-400/20" : "bg-white/20"
          )}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="md:w-auto flex items-center">
            <div className={cn(
              "mr-2 backdrop-blur-sm p-1.5 rounded-full",
              isDarkMode ? "bg-blue-400/20" : "bg-white/20"
            )}>
              <Flame className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white flex items-center">
                FLASH SALE
                <Zap className="h-3 w-3 ml-1 text-blue-200 animate-pulse" />
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
              <div className={cn(
                "bg-white rounded-md p-1 w-12 font-mono font-bold text-sm border-b-2 shadow-inner",
                isDarkMode 
                  ? "text-blue-700 border-blue-400" 
                  : "text-blue-600 border-blue-300"
              )}>
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
              <div className={cn(
                "bg-white rounded-md p-1 w-12 font-mono font-bold text-sm border-b-2 shadow-inner",
                isDarkMode 
                  ? "text-blue-700 border-blue-400" 
                  : "text-blue-600 border-blue-300"
              )}>
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
              <div className={cn(
                "bg-white rounded-md p-1 w-12 font-mono font-bold text-sm border-b-2 shadow-inner",
                isDarkMode 
                  ? "text-blue-700 border-blue-400" 
                  : "text-blue-600 border-blue-300"
              )}>
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
            <Button 
              size="sm" 
              className={cn(
                "bg-white font-bold text-xs py-1 px-3 group transition-colors shadow-md border-b-2",
                isDarkMode 
                  ? "text-blue-700 hover:bg-blue-50 border-blue-400" 
                  : "text-blue-600 hover:bg-blue-50 border-blue-200"
              )} 
              asChild
            >
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
