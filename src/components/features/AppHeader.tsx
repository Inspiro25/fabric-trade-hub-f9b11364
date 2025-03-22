
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sun, Sparkles } from 'lucide-react';
import NotificationBadge from '@/components/features/NotificationBadge';
import { useLocation } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Link to="/" className="text-gray-700 -ml-1">
              <ChevronLeft size={20} />
            </Link>
          )}
          <div className="flex items-center">
            <div className="flex items-center">
              <Sun className="h-5 w-5 text-kutuku-primary mr-1.5" />
              <Sparkles className="h-3 w-3 text-kutuku-primary absolute ml-1 -mt-2.5" />
            </div>
            <div className="ml-1">
              <h1 className="text-lg font-bold text-kutuku-primary relative">
                VYOMA
                <span className="absolute -top-1 right-0 h-1.5 w-1.5 bg-kutuku-primary rounded-full"></span>
              </h1>
              <p className="text-xs text-gray-500">Welcome back!</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBadge className="text-kutuku-primary" />
          <Link to="/search" className="text-kutuku-primary hover:text-kutuku-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AppHeader);
