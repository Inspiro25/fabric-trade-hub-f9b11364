import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import NotificationBadge from '@/components/features/NotificationBadge';
const AppHeader: React.FC = () => {
  return <div className="sticky top-0 z-10 bg-white px-4 shadow-sm py-[25px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-kutuku-primary">Kutuku</h1>
          <p className="text-xs text-gray-500">Welcome back!</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBadge />
          <Link to="/search" className="text-gray-700">
            <Search size={20} />
          </Link>
        </div>
      </div>
    </div>;
};
export default React.memo(AppHeader);