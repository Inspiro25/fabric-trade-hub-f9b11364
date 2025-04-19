import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ShopDetailHeaderProps {
  isDarkMode: boolean;
}

const ShopDetailHeader: React.FC<ShopDetailHeaderProps> = ({ isDarkMode }) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "sticky top-0 z-50 backdrop-blur-sm",
      isDarkMode 
        ? "bg-gradient-to-r from-blue-950/60 to-blue-900/60 shadow-lg" 
        : "bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex items-center justify-between",
          isMobile ? "py-2" : "py-3"
        )}>
          <div className="flex items-center">
            <Link to="/shops">
              <Button 
                size={isMobile ? "sm" : "icon"} 
                variant="ghost" 
                className={cn(
                  "mr-2",
                  isMobile ? "h-8 w-8" : "h-7 w-7",
                  "hover:bg-black/10"
                )}
              >
                <ArrowLeft className={cn(
                  isMobile ? "h-5 w-5" : "h-4 w-4"
                )} />
              </Button>
            </Link>
            <h1 className={cn(
              "font-medium",
              isMobile ? "text-xs" : "text-sm"
            )}>Shop Details</h1>
          </div>
          <Link to="/admin/login">
            <Button 
              size={isMobile ? "sm" : "sm"} 
              variant="ghost" 
              className={cn(
                "text-xs",
                isMobile ? "h-8 px-2.5" : "h-7 px-2",
                "hover:bg-black/10"
              )}
            >
              <Settings className={cn(
                "mr-1.5",
                isMobile ? "h-4 w-4" : "h-3.5 w-3.5"
              )} />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailHeader;
