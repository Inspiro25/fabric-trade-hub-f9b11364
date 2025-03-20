import React from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
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
}: MobileNavItemProps) => <Link to={to} className={cn("flex flex-col items-center justify-center text-xs font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
    <div className="mb-1">
      {icon}
    </div>
    <span>{label}</span>
  </Link>;
const MobileAppLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  return <div className="flex flex-col min-h-screen">
      {/* Content area */}
      <main className="flex-1 pb-16 py-[96px]">
        {children}
      </main>

      {/* Bottom navigation bar - Kutuku style */}
      <div className="fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t z-50">
        <div className="grid grid-cols-5 h-16">
          <MobileNavItem to="/" icon={<Home size={20} />} label="Home" isActive={pathname === '/'} />
          <MobileNavItem to="/search" icon={<Search size={20} />} label="Search" isActive={pathname === '/search'} />
          <MobileNavItem to="/cart" icon={<ShoppingBag size={20} />} label="Cart" isActive={pathname === '/cart'} />
          <MobileNavItem to="/wishlist" icon={<Heart size={20} />} label="Wishlist" isActive={pathname === '/wishlist'} />
          <MobileNavItem to="/auth" icon={<User size={20} />} label="Account" isActive={pathname === '/auth'} />
        </div>
      </div>
    </div>;
};
export default MobileAppLayout;