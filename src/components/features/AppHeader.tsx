
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
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
          <div>
            <h1 className="text-lg font-bold text-[#9b87f5]">Kutuku</h1>
            <p className="text-xs text-gray-500">Welcome back!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBadge className="text-[#9b87f5]" />
          <Link to="/search" className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors">
            <Search size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AppHeader);
