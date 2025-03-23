
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Store, 
  Heart, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogIn,
  User,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavProps {
  onClose?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const auth = useAuth ? useAuth() : { currentUser: null };
  const { currentUser } = auth;
  
  const menuItems = [
    { icon: <Home size={18} />, label: 'Home', path: '/' },
    { icon: <Percent size={18} />, label: 'Offers', path: '/offers' },
    { icon: <Store size={18} />, label: 'Shops', path: '/shops' },
    { icon: <Heart size={18} />, label: 'Wishlist', path: '/account/wishlist' },
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/account/settings' },
    { icon: <HelpCircle size={18} />, label: 'Help & Support', path: '/help' },
  ];

  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full py-6">
      <div className="px-2 mb-6">
        <h2 className={cn(
          "text-lg font-bold mb-1",
          isDarkMode ? "text-gray-100" : "text-gray-900"
        )}>
          Menu
        </h2>
        <p className={cn(
          "text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-500" 
        )}>
          Navigate through VYOMA
        </p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md",
                  location.pathname === item.path
                    ? isDarkMode 
                      ? "bg-gray-800 text-orange-400" 
                      : "bg-orange-50 text-orange-600"
                    : isDarkMode 
                      ? "text-gray-300 hover:bg-gray-800" 
                      : "text-gray-700 hover:bg-gray-50",
                )}
                onClick={handleNavigation}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className={isDarkMode ? "my-4 bg-gray-800" : "my-4"} />

      {currentUser ? (
        <div className={cn(
          "p-3 rounded-lg flex items-center",
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        )}>
          <div className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full mr-3 flex items-center justify-center",
            isDarkMode ? "bg-gray-700" : "bg-white"
          )}>
            <User size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              isDarkMode ? "text-gray-200" : "text-gray-900"
            )}>
              {currentUser.displayName || currentUser.email || "User"}
            </p>
            <Link
              to="/account"
              className={cn(
                "text-xs",
                isDarkMode ? "text-orange-400" : "text-orange-600"
              )}
              onClick={handleNavigation}
            >
              View Profile
            </Link>
          </div>
        </div>
      ) : (
        <Link
          to="/auth"
          className={cn(
            "flex items-center justify-center px-4 py-2.5 rounded-md",
            isDarkMode 
              ? "bg-orange-600 text-white hover:bg-orange-700" 
              : "bg-orange-500 text-white hover:bg-orange-600"
          )}
          onClick={handleNavigation}
        >
          <LogIn size={18} className="mr-2" />
          Sign In / Register
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
