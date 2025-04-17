
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Percent, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isDarkMode } = useTheme();
  const [showPulse, setShowPulse] = useState(false);
  
  const cartCount = getCartCount();
  
  // Add pulse effect when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { 
      icon: ShoppingCart, 
      path: '/cart', 
      label: 'Cart', 
      count: cartCount,
      isCart: true,
      customStyles: true 
    },
    { icon: Percent, path: '/offers', label: 'Offers' },
    { icon: Store, path: '/shops', label: 'Shops' },
  ];
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-16 z-40 border-t flex items-center justify-around px-2",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const isCart = item.isCart;
        const isCustomStyled = item.customStyles;
        
        // Special case for the cart (middle item)
        if (isCustomStyled) {
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex flex-col items-center justify-center relative"
              aria-label={item.label}
            >
              <motion.div 
                className={cn(
                  "flex items-center justify-center rounded-full w-12 h-12 -mt-6 shadow-md relative",
                  isDarkMode 
                    ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                    : "bg-gradient-to-br from-vyoma-primary to-vyoma-secondary"
                )}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart 
                  size={20} 
                  className="text-white" 
                />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                      scale: showPulse ? [1, 1.2, 1] : 1, 
                      opacity: 1 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 15,
                      scale: { 
                        duration: showPulse ? 0.5 : 0.3,
                        ease: "easeInOut"
                      }
                    }}
                    className={cn(
                      "absolute -top-1 -right-1 text-white text-xs font-bold rounded-full flex items-center justify-center bg-red-500",
                      cartCount > 9 ? "h-5 w-5 text-[10px]" : "h-4 w-4 text-[9px]"
                    )}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </motion.div>
              <span className={cn(
                "text-xs mt-4",
                isActive
                  ? isDarkMode ? "text-orange-400" : "text-vyoma-primary"
                  : isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        }
        
        // Regular nav items
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={cn(
              "flex flex-col items-center justify-center h-full w-full relative",
              isActive
                ? isDarkMode ? "text-orange-400" : "text-vyoma-primary"
                : isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
            aria-label={item.label}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon size={20} />
            </motion.div>
            <span className="text-xs mt-1">{item.label}</span>
            
            {isActive && (
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute -bottom-0 rounded-full h-1 transform -translate-x-1/2 left-1/2",
                  isDarkMode ? "bg-orange-400" : "bg-vyoma-primary"
                )}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNavigation;
