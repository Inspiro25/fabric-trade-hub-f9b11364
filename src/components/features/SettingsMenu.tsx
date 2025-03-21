
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';

const SettingsMenu = () => {
  const { currentUser, logout } = useAuth();
  
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
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 max-w-xs w-full">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetHeader className="text-left mb-2">
            <SheetTitle className="text-base">Account</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white">
              <AvatarImage src={currentUser?.photoURL || ""} alt="Profile" />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{currentUser?.displayName || "Guest User"}</p>
              <p className="text-xs text-gray-500">{currentUser?.email || "Not signed in"}</p>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.link} 
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50"
              >
                <span className="text-gray-500">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
          
          <Separator className="my-2" />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 w-full text-left hover:bg-gray-50"
          >
            <LogOut size={16} className="text-gray-500" />
            Sign Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
