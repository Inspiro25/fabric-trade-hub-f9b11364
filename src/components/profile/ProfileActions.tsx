
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, ShoppingBag, HelpCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileActionsProps = {
  onLogout: () => Promise<void>;
};

const ProfileActions = ({ onLogout }: ProfileActionsProps) => {
  const { isDarkMode } = useTheme();
  
  const actions = [
    {
      id: 'orders',
      label: 'My Orders',
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      href: '/account/orders', // Updated from /orders to /account/orders
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: '/account/settings', // Updated from /settings to /account/settings
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      href: '/help',
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link key={action.id} to={action.href} className="col-span-1">
            <Button 
              variant="outline" 
              className={cn(
                "w-full h-auto py-2 px-3 justify-start text-xs",
                isDarkMode 
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200" 
                  : "bg-white hover:bg-gray-50"
              )}
            >
              <span className={isDarkMode ? "text-orange-400" : "text-orange-500"}>
                {action.icon}
              </span>
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        onClick={onLogout}
        className={cn(
          "w-full justify-start text-sm",
          isDarkMode 
            ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-red-400 hover:text-red-300" 
            : "bg-white hover:bg-gray-50 text-red-600 hover:text-red-700"
        )}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileActions;
