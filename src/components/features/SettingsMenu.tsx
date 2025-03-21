
import React from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from "@/components/ui/switch";

const SettingsMenu = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const menuItems = [
    {
      name: 'My Profile',
      icon: <User size={16} />,
      link: '/profile',
    },
    {
      name: 'My Orders',
      icon: <Package size={16} />,
      link: '/orders',
    },
    {
      name: 'Order Tracking',
      icon: <MapPin size={16} />,
      link: '/tracking',
    },
    {
      name: 'Wishlist',
      icon: <Heart size={16} />,
      link: '/wishlist',
    },
    {
      name: 'Help & Support',
      icon: <HelpCircle size={16} />,
      link: '/help',
    },
    {
      name: 'Settings',
      icon: <Settings size={16} />,
      link: '/settings',
    },
    {
      name: 'Shop Login',
      icon: <Store size={16} />,
      link: '/admin/login',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-xs">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 max-w-xs w-full dark:bg-gray-800 dark:text-gray-200">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50">
          <SheetHeader className="text-left mb-2">
            <SheetTitle className="text-base dark:text-gray-100">Account</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white dark:border-gray-700">
              <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium dark:text-gray-100">{currentUser?.displayName || "Guest User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email || "Not signed in"}</p>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.link} 
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400">
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
          
          <Separator className="my-2 dark:bg-gray-700" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <LogOut size={16} className="text-gray-500 dark:text-gray-400" />
            Sign Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
