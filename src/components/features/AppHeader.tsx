
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sun, Sparkles, Flame, Moon } from 'lucide-react';
import NotificationBadge from '@/components/features/NotificationBadge';
import AccountDropdown from '@/components/features/AccountDropdown';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "sticky top-0 z-50 px-4 py-4 shadow-sm",
      isDarkMode 
        ? "bg-gradient-to-r from-orange-900/95 to-orange-950/95 backdrop-blur-sm" 
        : "bg-gradient-to-r from-orange-50/95 to-white/95 backdrop-blur-sm"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Link to="/" className={cn("text-gray-700 -ml-1", isDarkMode && "text-orange-200")}>
              <ChevronLeft size={20} />
            </Link>
          )}
          <div className="flex items-center">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 animate-pulse-subtle opacity-40 blur-md rounded-full",
                isDarkMode ? "bg-orange-500" : "bg-orange-300"
              )} />
              <div className="relative flex items-center">
                {isDarkMode ? (
                  <Flame className="h-5 w-5 text-orange-300 mr-1.5 animate-float" />
                ) : (
                  <Sun className="h-5 w-5 text-kutuku-primary mr-1.5 animate-float" />
                )}
                <Sparkles className={cn(
                  "h-3 w-3 absolute ml-1 -mt-2.5 animate-pulse-subtle",
                  isDarkMode ? "text-orange-300" : "text-kutuku-primary"
                )} />
              </div>
            </div>
            <div className="ml-1">
              <h1 className={cn(
                "text-lg font-bold relative",
                isDarkMode ? "text-orange-300" : "text-kutuku-primary"
              )}>
                VYOMA
                <span className={cn(
                  "absolute -top-1 right-0 h-1.5 w-1.5 rounded-full",
                  isDarkMode ? "bg-orange-300" : "bg-kutuku-primary"
                )}></span>
                <Sparkles className={cn(
                  "h-2 w-2 absolute -top-1 -right-3 animate-pulse-subtle",
                  isDarkMode ? "text-orange-300" : "text-kutuku-primary" 
                )} />
              </h1>
              <p className={cn(
                "text-xs",
                isDarkMode ? "text-orange-200/70" : "text-gray-500"
              )}>Welcome back!</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className={cn(
              "w-8 h-8 rounded-full p-0",
              isDarkMode ? "text-orange-300 hover:text-orange-200" : "text-kutuku-primary hover:text-kutuku-secondary"
            )}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <NotificationBadge className={cn(
            isDarkMode ? "text-orange-300" : "text-kutuku-primary"
          )} />
          
          <Link to="/search" className={cn(
            "hover:transition-colors",
            isDarkMode 
              ? "text-orange-300 hover:text-orange-200" 
              : "text-kutuku-primary hover:text-kutuku-secondary"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          
          <AccountDropdown />
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={cn(
        "absolute top-0 right-0 h-8 w-8 rounded-bl-full opacity-30",
        isDarkMode ? "bg-orange-700 opacity-20" : "bg-orange-100"
      )}></div>
      <div className={cn(
        "absolute bottom-0 left-0 h-3 w-24 bg-gradient-to-r opacity-40",
        isDarkMode ? "from-orange-600 to-transparent opacity-20" : "from-orange-200 to-transparent"
      )}></div>
    </div>
  );
};

export default React.memo(AppHeader);
