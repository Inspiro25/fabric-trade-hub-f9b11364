import React from 'react';
import { Home, Search, ShoppingBag, Percent, Store } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badgeCount?: number;
}

const MobileNavItem = ({
  to,
  icon,
  label,
  isActive,
  badgeCount
}: MobileNavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center text-[10px] font-medium",
      isActive ? "text-kutuku-primary" : "text-gray-500"
    )}
  >
    <div className={cn(
      "mb-1 flex items-center justify-center transition-transform relative",
      isActive ? "scale-110" : ""
    )}>
      {icon}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white rounded-full text-xs w-4 h-4 text-[10px]">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
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
  const { getCartCount } = useCart();
  const cartItemCount = getCartCount();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content area */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom navigation bar - Mobile app style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex h-16 items-center justify-around px-2">
          <MobileNavItem 
            to="/" 
            icon={<Home size={20} strokeWidth={pathname === '/' ? 2.5 : 1.8} />} 
            label="Home" 
            isActive={pathname === '/'} 
          />
          <MobileNavItem 
            to="/search" 
            icon={<Search size={20} strokeWidth={pathname.includes('/search') ? 2.5 : 1.8} />} 
            label="Search" 
            isActive={pathname.includes('/search')} 
          />
          <div className="relative flex flex-col items-center">
            <Link
              to="/cart"
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full bg-kutuku-primary text-white -mt-6 shadow-md relative",
                pathname === '/cart' ? "bg-kutuku-secondary" : "bg-kutuku-primary"
              )}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white rounded-full text-xs w-5 h-5">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            <span className="text-[10px] font-medium mt-1 text-gray-500">Cart</span>
          </div>
          <MobileNavItem 
            to="/offers" 
            icon={<Percent size={20} strokeWidth={pathname === '/offers' ? 2.5 : 1.8} />} 
            label="Offers" 
            isActive={pathname === '/offers'} 
          />
          <MobileNavItem 
            to="/shops" 
            icon={<Store size={20} strokeWidth={pathname.includes('/shop') ? 2.5 : 1.8} />} 
            label="Shops" 
            isActive={pathname === '/shops' || pathname.includes('/shop/')} 
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAppLayout;
