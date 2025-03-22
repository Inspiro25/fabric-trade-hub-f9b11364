
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Heart,
  HelpCircle,
  Settings,
  Store,
  Moon,
  Sun,
  LogIn,
  ShoppingCart,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SettingsMenu = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const isLoggedIn = !!currentUser;
  
  const menuItems = [
    {
      name: 'My Profile',
      icon: <User size={16} />,
      link: '/profile',
      requiresAuth: false,
    },
    {
      name: 'My Orders',
      icon: <Package size={16} />,
      link: '/orders',
      requiresAuth: true,
    },
    {
      name: 'My Cart',
      icon: <ShoppingCart size={16} />,
      link: '/cart',
      requiresAuth: false,
    },
    {
      name: 'Order Tracking',
      icon: <MapPin size={16} />,
      link: '/tracking',
      requiresAuth: true,
    },
    {
      name: 'Wishlist',
      icon: <Heart size={16} />,
      link: '/wishlist',
      requiresAuth: false,
    },
    {
      name: 'Notifications',
      icon: <Bell size={16} />,
      link: '/notifications',
      requiresAuth: false,
    },
    {
      name: 'Help & Support',
      icon: <HelpCircle size={16} />,
      link: '/help',
      requiresAuth: false,
    },
    {
      name: 'Settings',
      icon: <Settings size={16} />,
      link: '/settings',
      requiresAuth: false,
    },
    {
      name: 'Shop Login',
      icon: <Store size={16} />,
      link: '/admin/login',
      requiresAuth: false,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className={cn(
          "p-1.5 rounded-full transition-colors",
          isDarkMode 
            ? "hover:bg-gray-700 text-gray-200" 
            : "hover:bg-gray-100 text-gray-800"
        )}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
            <AvatarFallback className={cn(
              "text-xs",
              isDarkMode 
                ? "bg-blue-900 text-blue-200" 
                : "bg-blue-100 text-blue-600"
            )}>
              {isLoggedIn 
                ? (userProfile?.displayName?.[0] || currentUser?.email?.[0] || "U") 
                : "G"}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className={cn(
        "p-0 max-w-xs w-full",
        isDarkMode 
          ? "bg-gray-800 text-gray-200" 
          : "bg-white text-gray-800"
      )}>
        <div className={cn(
          "p-4",
          isDarkMode 
            ? "bg-gradient-to-r from-blue-900/40 to-indigo-900/40" 
            : "bg-gradient-to-r from-blue-50 to-indigo-50"
        )}>
          <SheetHeader className="text-left mb-2">
            <SheetTitle className={cn(
              "text-base",
              isDarkMode ? "text-gray-100" : "text-gray-800"
            )}>Account</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-3">
            <Avatar className={cn(
              "h-11 w-11 border-2",
              isDarkMode ? "border-gray-700" : "border-white"
            )}>
              <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
              <AvatarFallback className={cn(
                isDarkMode 
                  ? "bg-blue-900 text-blue-200" 
                  : "bg-blue-100 text-blue-600"
              )}>
                {isLoggedIn 
                  ? (userProfile?.displayName?.[0] || currentUser?.email?.[0] || "U") 
                  : "G"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-gray-100" : "text-gray-800"
              )}>
                {isLoggedIn 
                  ? (userProfile?.displayName || currentUser?.displayName || currentUser?.email || "User") 
                  : "Guest User"}
              </p>
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                {isLoggedIn ? currentUser?.email : "Not signed in"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          <div className="space-y-0.5">
            {menuItems
              .filter(item => !item.requiresAuth || isLoggedIn)
              .map((item) => (
                <Link 
                  key={item.name} 
                  to={item.link} 
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm",
                    isDarkMode 
                      ? "hover:bg-gray-700" 
                      : "hover:bg-gray-50"
                  )}
                >
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            
            <div className={cn(
              "flex items-center justify-between px-4 py-2.5 text-sm",
              isDarkMode 
                ? "hover:bg-gray-700" 
                : "hover:bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                </span>
                Dark Mode
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>
          
          <Separator className={isDarkMode ? "my-2 bg-gray-700" : "my-2"} />
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left",
                isDarkMode 
                  ? "text-red-400 hover:bg-gray-700" 
                  : "text-red-600 hover:bg-gray-50"
              )}
            >
              <LogOut size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left",
                isDarkMode 
                  ? "text-blue-400 hover:bg-gray-700" 
                  : "text-blue-600 hover:bg-gray-50"
              )}
            >
              <LogIn size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              Sign In
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
