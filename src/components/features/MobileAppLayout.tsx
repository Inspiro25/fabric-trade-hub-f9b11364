
import React from 'react';
import { Home, Search, ShoppingBag, Percent, Store } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const MobileNavItem = ({
  to,
  icon,
  label,
  isActive
}: MobileNavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center text-xs font-medium",
      isActive ? "text-kutuku-primary" : "text-gray-500"
    )}
  >
    <div className={cn(
      "mb-1 flex items-center justify-center transition-transform",
      isActive ? "scale-110" : ""
    )}>
      {icon}
    </div>
    <span>{label}</span>
  </Link>
);

const MobileAppLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Content area */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom navigation bar - Mobile app style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
        <div className="grid grid-cols-5 h-16">
          <MobileNavItem 
            to="/" 
            icon={<Home size={20} />} 
            label="Home" 
            isActive={pathname === '/'} 
          />
          <MobileNavItem 
            to="/search" 
            icon={<Search size={20} />} 
            label="Search" 
            isActive={pathname.includes('/search')} 
          />
          <MobileNavItem 
            to="/cart" 
            icon={<ShoppingBag size={20} />} 
            label="Cart" 
            isActive={pathname === '/cart'} 
          />
          <MobileNavItem 
            to="/offers" 
            icon={<Percent size={20} />} 
            label="Offers" 
            isActive={pathname === '/offers'} 
          />
          <MobileNavItem 
            to="/shops" 
            icon={<Store size={20} />} 
            label="Shops" 
            isActive={pathname === '/shops' || pathname.includes('/shop/')} 
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAppLayout;
