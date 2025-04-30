import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext.tsx';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  
  const wishlistCount = wishlistItems?.length || 0;

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
    },
    {
      path: '/search',
      label: 'Search',
      icon: Search,
    },
    {
      path: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      count: getCartCount(),
    },
    {
      path: '/wishlist',
      label: 'Wishlist',
      icon: Heart,
      count: wishlistCount,
      requiresAuth: true,
    },
    {
      path: currentUser ? '/account/settings' : '/auth/login',
      label: currentUser ? 'Profile' : 'Sign In',
      icon: User,
    },
  ];

  const handleNavigation = (path: string, requiresAuth: boolean = false) => {
    if (requiresAuth && !currentUser) {
      navigate('/auth/login', { 
        state: { from: location.pathname } 
      });
      return;
    }
    navigate(path);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-5 items-center border-t px-2",
      isDarkMode 
        ? "bg-gray-900 border-gray-800" 
        : "bg-white border-gray-200"
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path, item.requiresAuth)}
            className={cn(
              "flex flex-col items-center justify-center h-full w-full relative",
              isActive
                ? isDarkMode ? "text-blue-400" : "text-blue-600"
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
            
            {item.count > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 h-4 min-w-4 rounded-full text-[10px] font-medium flex items-center justify-center px-1",
                isDarkMode 
                  ? "bg-blue-500 text-white" 
                  : "bg-blue-600 text-white"
              )}>
                {item.count}
              </span>
            )}
            
            {isActive && (
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute -bottom-0 rounded-full h-1 transform -translate-x-1/2 left-1/2",
                  isDarkMode ? "bg-blue-400" : "bg-blue-600"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileNavigation;
