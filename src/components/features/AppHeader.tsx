
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sun, Sparkles, Flame, Stars } from 'lucide-react';
import NotificationBadge from '@/components/features/NotificationBadge';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "sticky top-0 z-10 px-4 py-4 shadow-sm",
      isDarkMode 
        ? "bg-gradient-to-r from-orange-900/90 to-orange-950/90 backdrop-blur-sm" 
        : "bg-gradient-to-r from-orange-50 to-white"
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
              <div className="absolute inset-0 animate-pulse-subtle opacity-40 blur-md rounded-full bg-orange-300 dark:bg-orange-500" />
              <div className="relative flex items-center">
                <Sun className={cn(
                  "h-5 w-5 text-kutuku-primary mr-1.5 animate-float",
                  isDarkMode && "text-orange-300"
                )} />
                <Sparkles className={cn(
                  "h-3 w-3 text-kutuku-primary absolute ml-1 -mt-2.5 animate-pulse-subtle",
                  isDarkMode && "text-orange-300"
                )} />
              </div>
            </div>
            <div className="ml-1">
              <h1 className={cn(
                "text-lg font-bold text-kutuku-primary relative",
                isDarkMode && "text-orange-300"
              )}>
                VYOMA
                <span className={cn(
                  "absolute -top-1 right-0 h-1.5 w-1.5 rounded-full",
                  isDarkMode ? "bg-orange-300" : "bg-kutuku-primary"
                )}></span>
                <Sparkles className={cn(
                  "h-2 w-2 absolute -top-1 -right-3 text-kutuku-primary animate-pulse-subtle",
                  isDarkMode && "text-orange-300" 
                )} />
              </h1>
              <p className={cn(
                "text-xs text-gray-500",
                isDarkMode && "text-orange-200/70"
              )}>Welcome back!</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBadge className={cn(
            "text-kutuku-primary",
            isDarkMode && "text-orange-300"
          )} />
          <Link to="/search" className={cn(
            "text-kutuku-primary hover:text-kutuku-secondary transition-colors",
            isDarkMode && "text-orange-300 hover:text-orange-200"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-8 w-8 rounded-bl-full bg-orange-100 opacity-30 dark:bg-orange-700 dark:opacity-20"></div>
      <div className="absolute bottom-0 left-0 h-3 w-24 bg-gradient-to-r from-orange-200 to-transparent opacity-40 dark:from-orange-600 dark:opacity-20"></div>
    </div>
  );
};

export default React.memo(AppHeader);
