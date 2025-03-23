
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Tag, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isDarkMode } = useTheme();
  
  const cartCount = getCartCount();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: ShoppingCart, path: '/cart', label: 'Cart', count: cartCount },
    { icon: Tag, path: '/offers', label: 'Offers' },
    { icon: Store, path: '/shops', label: 'Shops' },
  ];
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-16 z-40 border-t flex items-center justify-around px-2",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={cn(
              "flex flex-col items-center justify-center h-full w-full relative",
              isActive
                ? isDarkMode ? "text-orange-400" : "text-kutuku-primary"
                : isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            <div className="relative">
              <item.icon size={20} />
              {(item.count && item.count > 0) && (
                <span className={cn(
                  "absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center",
                )}>
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
            
            {isActive && (
              <span className={cn(
                "absolute -bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-10",
                isDarkMode ? "bg-orange-400" : "bg-kutuku-primary"
              )}></span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileNavigation;
