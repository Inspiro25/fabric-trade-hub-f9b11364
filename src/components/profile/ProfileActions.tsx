
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { LogOut, Settings, HelpCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProfileActionsProps {
  onLogout: () => Promise<void>; // Add this to the interface
}

const ProfileActions = ({ onLogout }: ProfileActionsProps) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "flex justify-center gap-2 mb-6",
      isDarkMode ? "text-gray-300" : "text-gray-700"
    )}>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex gap-1 items-center"
        onClick={() => navigate('/account/orders')}
      >
        <ShoppingBag size={14} />
        <span>Orders</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex gap-1 items-center"
        onClick={() => navigate('/account/settings')}
      >
        <Settings size={14} />
        <span>Settings</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex gap-1 items-center"
        onClick={() => navigate('/help')}
      >
        <HelpCircle size={14} />
        <span>Help</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={cn(
          "flex gap-1 items-center",
          isDarkMode ? "hover:text-red-400 hover:border-red-400" : "hover:text-red-600 hover:border-red-500"
        )}
        onClick={onLogout}
      >
        <LogOut size={14} />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default ProfileActions;
