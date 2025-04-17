
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ShopDetailHeaderProps {
  isDarkMode: boolean;
}

const ShopDetailHeader: React.FC<ShopDetailHeaderProps> = ({ isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-950/60 to-orange-900/60' : 'bg-gradient-to-r from-orange-100 to-orange-200'} shadow-sm`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Link to="/shops">
              <Button size="icon" variant="ghost" className="h-7 w-7 mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-sm font-medium">Shop Details</h1>
          </div>
          <Link to="/admin/login">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailHeader;
